#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use anchor_lang::system_program::{self, Transfer as SystemTransfer};

declare_id!("F5jE4FMaARnKG79qLMtaGmhNHjb1LM9s2Bo3wH6QYZRK");

#[program]
pub mod sendacoin {
    use super::*;

    pub fn process_order(
        ctx: Context<ProcessOrder>,
        order_id: String,
        amount: u64,
        is_sol: bool,
    ) -> Result<()> {
        let fee_amount = amount.checked_mul(1).unwrap().checked_div(100).unwrap();
        let transfer_amount = amount.checked_sub(fee_amount).unwrap();

        // Store payment details
        let payment_details = &mut ctx.accounts.payment_details;
        payment_details.order_id = order_id;
        payment_details.amount = amount;
        payment_details.payer = ctx.accounts.payer.key();
        payment_details.is_sol = is_sol;
        payment_details.timestamp = Clock::get()?.unix_timestamp;

        if is_sol {
            payment_details.merchant = ctx.accounts.merchant_wallet.as_ref().unwrap().key();
            payment_details.token_mint = None;

            // Handle native SOL transfer
            system_program::transfer(
                CpiContext::new(
                    ctx.accounts.system_program.as_ref().unwrap().to_account_info(),
                    SystemTransfer {
                        from: ctx.accounts.payer.to_account_info(),
                        to: ctx.accounts.merchant_wallet.as_ref().unwrap().to_account_info(),
                    },
                ),
                transfer_amount,
            )?;

            // Transfer SOL fee
            system_program::transfer(
                CpiContext::new(
                    ctx.accounts.system_program.as_ref().unwrap().to_account_info(),
                    SystemTransfer {
                        from: ctx.accounts.payer.to_account_info(),
                        to: ctx.accounts.fee_wallet.as_ref().unwrap().to_account_info(),
                    },
                ),
                fee_amount,
            )?;
        } else {
            payment_details.merchant = ctx.accounts.merchant_token_account.as_ref().unwrap().key();
            payment_details.token_mint = Some(ctx.accounts.merchant_token_account.as_ref().unwrap().mint);

            // Existing SPL token transfer logic
            token::transfer(
                ctx.accounts.transfer_to_merchant_context(),
                transfer_amount,
            )?;

            token::transfer(
                ctx.accounts.transfer_fee_context(),
                fee_amount,
            )?;
        }

        Ok(())
    }

    pub fn verify_payment(
        ctx: Context<VerifyPayment>,
        order_id: String,
    ) -> Result<PaymentResponse> {
        let details = &ctx.accounts.payment_details;
        
        let fee_amount = details.amount.checked_mul(1).unwrap().checked_div(100).unwrap();
        let transfer_amount = details.amount.checked_sub(fee_amount).unwrap();

        Ok(PaymentResponse {
            order_id: details.order_id.clone(),
            total_amount: details.amount,
            merchant_amount: transfer_amount,
            fee_amount,
            payer: details.payer,
            merchant: details.merchant,
            is_sol: details.is_sol,
            token_mint: details.token_mint,
            timestamp: details.timestamp,
        })
    }
}

#[derive(Accounts)]
#[instruction(order_id: String, amount: u64, is_sol: bool)]
pub struct ProcessOrder<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    // For SPL tokens
    #[account(mut)]
    pub payer_token_account: Option<Account<'info, TokenAccount>>,
    #[account(mut)]
    pub merchant_token_account: Option<Account<'info, TokenAccount>>,
    #[account(
        mut,
        constraint = fee_account.owner == FEE_WALLET_ADDRESS.parse::<Pubkey>().unwrap()
    )]
    pub fee_account: Option<Account<'info, TokenAccount>>,
    pub token_program: Option<Program<'info, Token>>,

    // For native SOL
    #[account(mut)]
    pub merchant_wallet: Option<AccountInfo<'info>>,
    #[account(mut)]
    pub fee_wallet: Option<AccountInfo<'info>>,
    pub system_program: Option<Program<'info, System>>,

    // Payment details storage
    #[account(
        init,
        payer = payer,
        space = 8 + 32 + 32 + 32 + 32 + 8 + 8 + 1 + 200, // Adjust space as needed
        seeds = [b"payment", order_id.as_bytes()],
        bump
    )]
    pub payment_details: Account<'info, PaymentDetails>,
}

impl<'info> ProcessOrder<'info> {
    fn transfer_to_merchant_context(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        CpiContext::new(
            self.token_program.as_ref().unwrap().to_account_info(),
            Transfer {
                from: self.payer_token_account.as_ref().unwrap().to_account_info(),
                to: self.merchant_token_account.as_ref().unwrap().to_account_info(),
                authority: self.payer.to_account_info(),
            },
        )
    }

    fn transfer_fee_context(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        CpiContext::new(
            self.token_program.as_ref().unwrap().to_account_info(),
            Transfer {
                from: self.payer_token_account.as_ref().unwrap().to_account_info(),
                to: self.fee_account.as_ref().unwrap().to_account_info(),
                authority: self.payer.to_account_info(),
            },
        )
    }
}

#[derive(Accounts)]
#[instruction(order_id: String)]
pub struct VerifyPayment<'info> {
    #[account(
        seeds = [b"payment", order_id.as_bytes()],
        bump,
        constraint = payment_details.order_id == order_id
    )]
    pub payment_details: Account<'info, PaymentDetails>,
}

#[account]
pub struct PaymentDetails {
    pub order_id: String,          // Order identifier
    pub amount: u64,               // Total amount paid
    pub payer: Pubkey,            // Payer's wallet address
    pub merchant: Pubkey,         // Merchant's wallet/token account
    pub is_sol: bool,             // Whether this was a SOL or SPL payment
    pub timestamp: i64,           // Unix timestamp
    pub token_mint: Option<Pubkey>, // Token mint address (null for SOL)
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct PaymentResponse {
    pub order_id: String,
    pub total_amount: u64,
    pub merchant_amount: u64,
    pub fee_amount: u64,
    pub payer: Pubkey,
    pub merchant: Pubkey,
    pub is_sol: bool,
    pub token_mint: Option<Pubkey>,
    pub timestamp: i64,
}

// Constants
pub const FEE_WALLET_ADDRESS: &str = "H9uN6Jn6rV4ZcwBhkLS1JSnPxrFGBsszuRS1mjYY3vcf";
