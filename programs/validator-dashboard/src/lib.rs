use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock::Clock;

declare_id!("9KxB22cPSBkKXJJ9wusjQkfeVUrbT5qzCWdhCpnW5dpC");

#[program]
pub mod validator_dashboard {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let dashboard = &mut ctx.accounts.dashboard;
        dashboard.authority = ctx.accounts.authority.key();
        dashboard.alert_threshold = 95; // Default 95% uptime threshold
        Ok(())
    }

    pub fn update_validator_stats(
        ctx: Context<UpdateStats>,
        uptime: u64,
        stake_amount: u64,
        commission: u8,
        rewards: u64,
    ) -> Result<()> {
        let dashboard = &mut ctx.accounts.dashboard;
        dashboard.uptime = uptime;
        dashboard.stake_amount = stake_amount;
        dashboard.commission = commission;
        dashboard.rewards = rewards;
        dashboard.last_updated = Clock::get()?.unix_timestamp;
        
        // Check alert threshold
        if uptime < dashboard.alert_threshold {
            emit!(AlertTriggered {
                validator: dashboard.key(),
                uptime,
                threshold: dashboard.alert_threshold,
            });
        }
        
        Ok(())
    }

    pub fn set_alert_threshold(ctx: Context<SetThreshold>, threshold: u64) -> Result<()> {
        ctx.accounts.dashboard.alert_threshold = threshold;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + ValidatorDashboard::INIT_SPACE
    )]
    pub dashboard: Account<'info, ValidatorDashboard>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateStats<'info> {
    #[account(
        mut,
        has_one = authority
    )]
    pub dashboard: Account<'info, ValidatorDashboard>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct SetThreshold<'info> {
    #[account(
        mut,
        has_one = authority
    )]
    pub dashboard: Account<'info, ValidatorDashboard>,
    pub authority: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct ValidatorDashboard {
    pub authority: Pubkey,
    pub uptime: u64,
    pub stake_amount: u64,
    pub commission: u8,
    pub rewards: u64,
    pub alert_threshold: u64,
    pub last_updated: i64,
}

#[event]
pub struct AlertTriggered {
    pub validator: Pubkey,
    pub uptime: u64,
    pub threshold: u64,
}