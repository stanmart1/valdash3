use anyhow::Result;
use solana_client::rpc_client::RpcClient;
use solana_sdk::pubkey::Pubkey;
use serde::{Deserialize, Serialize};
use std::str::FromStr;
use tokio::time::{sleep, Duration};

#[derive(Debug, Serialize, Deserialize)]
pub struct ValidatorStats {
    pub uptime: f64,
    pub stake_amount: u64,
    pub commission: u8,
    pub rewards: u64,
    pub apr: f64,
}

pub struct ValidatorMonitor {
    rpc_client: RpcClient,
    validator_pubkey: Pubkey,
}

impl ValidatorMonitor {
    pub fn new(rpc_url: &str, validator_pubkey: &str) -> Result<Self> {
        let rpc_client = RpcClient::new(rpc_url);
        let validator_pubkey = Pubkey::from_str(validator_pubkey)?;
        
        Ok(Self {
            rpc_client,
            validator_pubkey,
        })
    }

    pub async fn fetch_validator_stats(&self) -> Result<ValidatorStats> {
        // Fetch vote account info
        let vote_accounts = self.rpc_client.get_vote_accounts()?;
        
        let validator = vote_accounts
            .current
            .iter()
            .find(|v| v.node_pubkey == self.validator_pubkey.to_string())
            .or_else(|| {
                vote_accounts
                    .delinquent
                    .iter()
                    .find(|v| v.node_pubkey == self.validator_pubkey.to_string())
            });

        if let Some(validator) = validator {
            let uptime = (validator.epoch_credits.len() as f64 / 432.0) * 100.0; // Rough uptime calc
            let stake_amount = validator.activated_stake;
            let commission = validator.commission;
            
            // Calculate rewards and APR (simplified)
            let rewards = validator.epoch_credits
                .iter()
                .map(|(_, credits, _)| *credits)
                .sum::<u64>();
            
            let apr = (rewards as f64 / stake_amount as f64) * 365.0 * 100.0;

            Ok(ValidatorStats {
                uptime,
                stake_amount,
                commission,
                rewards,
                apr,
            })
        } else {
            Err(anyhow::anyhow!("Validator not found"))
        }
    }

    pub async fn monitor_loop(&self) -> Result<()> {
        loop {
            match self.fetch_validator_stats().await {
                Ok(stats) => {
                    println!("Validator Stats: {:#?}", stats);
                    
                    // Check alert threshold
                    if stats.uptime < 95.0 {
                        println!("🚨 ALERT: Validator uptime below threshold: {:.2}%", stats.uptime);
                    }
                }
                Err(e) => {
                    eprintln!("Error fetching stats: {}", e);
                }
            }
            
            sleep(Duration::from_secs(60)).await; // Check every minute
        }
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    let rpc_url = std::env::var("SOLANA_RPC_URL")
        .unwrap_or_else(|_| "https://api.mainnet-beta.solana.com".to_string());
    
    let validator_pubkey = std::env::var("VALIDATOR_PUBKEY")
        .expect("VALIDATOR_PUBKEY environment variable required");

    let monitor = ValidatorMonitor::new(&rpc_url, &validator_pubkey)?;
    
    println!("Starting validator monitoring for: {}", validator_pubkey);
    monitor.monitor_loop().await?;
    
    Ok(())
}