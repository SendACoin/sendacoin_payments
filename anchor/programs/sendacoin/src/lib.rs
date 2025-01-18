#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("F5jE4FMaARnKG79qLMtaGmhNHjb1LM9s2Bo3wH6QYZRK");

#[program]
pub mod sendacoin {
    use super::*;

    pub fn process_order(
        ctx: Context<ProcessOrder>,
        _order_id: String,
        amount: u64,
    ) -> Result<()> {
        // Calculate fee amount (1%)
        let fee_amount = amount.checked_mul(1).unwrap().checked_div(100).unwrap();
        let transfer_amount = amount.checked_sub(fee_amount).unwrap();

        // Transfer 99% to merchant
        token::transfer(
            ctx.accounts.transfer_to_merchant_context(),
            transfer_amount,
        )?;

        // Transfer 1% fee
        token::transfer(
            ctx.accounts.transfer_fee_context(),
            fee_amount,
        )?;

        Ok(())
    }

    pub fn verify_payment(
        ctx: Context<VerifyPayment>,
        order_id: String,
        expected_amount: u64,
    ) -> Result<bool> {
        // Calculate expected fee amount (1%)
        let expected_fee = expected_amount.checked_mul(1).unwrap().checked_div(100).unwrap();
        let expected_transfer = expected_amount.checked_sub(expected_fee).unwrap();

        // Verify the token account balances match expected transfers
        let merchant_balance = ctx.accounts.merchant_token_account.amount;
        let fee_account_balance = ctx.accounts.fee_account.amount;

        // Return true if the balances are greater than or equal to expected amounts
        // Note: We check >= because there might be other payments to these accounts
        Ok(merchant_balance >= expected_transfer && fee_account_balance >= expected_fee)
    }
}

#[derive(Accounts)]
#[instruction(order_id: String, amount: u64)]
pub struct ProcessOrder<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(mut)]
    pub payer_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub merchant_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = fee_account.owner == FEE_WALLET_ADDRESS.parse::<Pubkey>().unwrap()
    )]
    pub fee_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

impl<'info> ProcessOrder<'info> {
    fn transfer_to_merchant_context(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        CpiContext::new(
            self.token_program.to_account_info(),
            Transfer {
                from: self.payer_token_account.to_account_info(),
                to: self.merchant_token_account.to_account_info(),
                authority: self.payer.to_account_info(),
            },
        )
    }

    fn transfer_fee_context(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        CpiContext::new(
            self.token_program.to_account_info(),
            Transfer {
                from: self.payer_token_account.to_account_info(),
                to: self.fee_account.to_account_info(),
                authority: self.payer.to_account_info(),
            },
        )
    }
}

// Add new account struct for verification
#[derive(Accounts)]
#[instruction(order_id: String, expected_amount: u64)]
pub struct VerifyPayment<'info> {
    /// The merchant's token account to verify
    pub merchant_token_account: Account<'info, TokenAccount>,
    
    /// The fee account to verify
    #[account(
        constraint = fee_account.owner == FEE_WALLET_ADDRESS.parse::<Pubkey>().unwrap()
    )]
    pub fee_account: Account<'info, TokenAccount>,
}

// Constants
pub const FEE_WALLET_ADDRESS: &str = "H9uN6Jn6rV4ZcwBhkLS1JSnPxrFGBsszuRS1mjYY3vcf";
