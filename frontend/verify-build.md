How do I create verified builds?
To create verified builds, you'll need to follow these steps:

Summary:

Commit your code to a public repository
Build a verified build in docker
Deploy the verified build
Verify the deployed program against public API
If you verify your program which is not build in a docker container it will most likely fail because Solana program builds are not deterministic across different systems.

Install Docker and Cargo
Install the necessary tools ensure you have Docker and Cargo installed. Docker provides a controlled build environment to ensure consistency, and Cargo is used for managing Rust packages.

Docker: Follow the steps on the Docker website to install Docker for your platform. Once installed, ensure the Docker service is running following this guide further.
Cargo: If you don’t already have Cargo installed, you can install it by running the following command:

curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
Install the Solana Verify CLI
The Solana Verify CLI is the primary tool used to verify builds. Solana Verify CLI is currently maintained by Ellipsis Labs and can be installed using Cargo.

You can install it by running:


cargo install solana-verify
If you need a specific version of the CLI, you can pin the version with:


cargo install solana-verify --version $VERSION
If desired, you can install a version directly from a specific commit:


cargo install solana-verify --git https://github.com/Ellipsis-Labs/solana-verifiable-build --rev 13a1db2
Prepare project
To verify against a repository it needs to have a Cargo.lock file in the root directory of your repository. If you only have one program in your repository and a cargo.lock file in your root you can directly go to the next step and build your program.

If your program is in a subfolder and you have a rust workspace you need to create a workspace Cargo.toml file in the root directory of your repository.

You can use this Cargo.toml example as a preset:

Cargo.toml

[workspace]
members = ["program/programs/*"]
resolver = "2"

[profile.release]
overflow-checks = true
lto = "fat"
codegen-units = 1

[profile.release.build-override]
opt-level = 3
incremental = false
codegen-units = 1
Make sure that your program is in the workspace/members array and that the Cargo.toml of your program has the correct lib name configured.

Important is the lib name not the package name!

Something like this:

waffle/Cargo.toml

[package]
name = "waffle"
version = "0.1.0"
edition = "2021"

[lib]
name = "waffle"
crate-type = ["cdylib", "lib"]

[dependencies]
solana-program = "2.1.0"
In this repository you can see an example of a workspace with a program in a subfolder. Notice also that when the program is in a subfolder you later need to add this folder as --mount-path to the verify-from-repo command.

In this repository you can find an anchor example. In this repository you can find a native rust example.

With this Cargo.toml file in place you can then run cargo generate-lockfile to create a lock file and continue to building your program.

Building Verifiable Programs
To verifiably build your Solana program, navigate to the directory containing your workspace's Cargo.toml file and run:


solana-verify build
This will copy your environment into a docker container and build it in a deterministic way.

Make sure that you actually deploy the verified build and don't accidentally overwrite it with anchor build or cargo build-sbf since these will most likely not result into the same hash and though your verification will fail.

For projects with multiple programs, you can build a specific program by using the library name (not the package name):


solana-verify build --library-name $PROGRAM_LIB_NAME
This process ensures deterministic builds and can take some time, especially on certain systems (e.g., M1 MacBook) because it is running within a docker container. For faster builds, using a Linux machine running x86 architecture is recommended.

Once the build completes, you can retrieve the hash of the executable using the following command:


solana-verify get-executable-hash target/deploy/$PROGRAM_LIB_NAME.so
Deploying Verifiable Programs
Once you have built your program and retrieved its hash, you can deploy it to the Solana network. It is recommended to use a multi-signature or governance solution like Squads Protocol for safe deployments, but you can also directly deploy with:


solana program deploy -u $NETWORK_URL target/deploy/$PROGRAM_LIB_NAME.so --program-id $PROGRAM_ID --with-compute-unit-price 50000 --max-sign-attempts 100 --use-rpc
A currently fitting low priority fee you can request from your rpc provider for example Quicknode.

To verify the deployed program matches the built executable, run:


solana-verify get-program-hash -u $NETWORK_URL $PROGRAM_ID
You may have different versions deployed on different Solana clusters (i.e. devnet, testnet, mainnet). Ensure you use the correct network URL for the desired Solana cluster you want to verify a program against. Remote verification will only work on mainnet.

Verifying against repositories
To verify a program against its public repository, use:


solana-verify verify-from-repo -u $NETWORK_URL --program-id $PROGRAM_ID https://github.com/$REPO_PATH --commit-hash $COMMIT_HASH --library-name $PROGRAM_LIB_NAME --mount-path $MOUNT_PATH
While you run the verified build in your program directory, when running verify-from-repo you need to add the --mount-path flag. This will be the path to the folder containing the Cargo.toml that contains your program's library name.

This command compares the onchain program hash with the executable hash built from the source at the specified commit hash.

At the end the command will ask you if you want to upload your verification data onchain. If you do that the Solana Explorer will immediately show your program's verification data. Until it was verified by a remote build it will show as unverified. Learn how you can verify your program against a public API in the next step.

If you want to lock the verification to a certain release, you can append the --commit-hash flag to the command.