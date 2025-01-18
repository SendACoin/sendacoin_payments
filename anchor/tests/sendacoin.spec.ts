import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Sendacoin} from '../target/types/sendacoin'

describe('sendacoin', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Sendacoin as Program<Sendacoin>

  const sendacoinKeypair = Keypair.generate()

  it('Initialize Sendacoin', async () => {
    await program.methods
      .initialize()
      .accounts({
        sendacoin: sendacoinKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([sendacoinKeypair])
      .rpc()

    const currentCount = await program.account.sendacoin.fetch(sendacoinKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Sendacoin', async () => {
    await program.methods.increment().accounts({ sendacoin: sendacoinKeypair.publicKey }).rpc()

    const currentCount = await program.account.sendacoin.fetch(sendacoinKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Sendacoin Again', async () => {
    await program.methods.increment().accounts({ sendacoin: sendacoinKeypair.publicKey }).rpc()

    const currentCount = await program.account.sendacoin.fetch(sendacoinKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Sendacoin', async () => {
    await program.methods.decrement().accounts({ sendacoin: sendacoinKeypair.publicKey }).rpc()

    const currentCount = await program.account.sendacoin.fetch(sendacoinKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set sendacoin value', async () => {
    await program.methods.set(42).accounts({ sendacoin: sendacoinKeypair.publicKey }).rpc()

    const currentCount = await program.account.sendacoin.fetch(sendacoinKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the sendacoin account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        sendacoin: sendacoinKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.sendacoin.fetchNullable(sendacoinKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
