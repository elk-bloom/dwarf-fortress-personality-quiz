1. [Install the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html).
    
    Linux:
    ```bash
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip awscliv2.zip
    sudo ./aws/install
    ```
    
2. [Configure the AWS CLI using the aws configure sso wizard](https://docs.aws.amazon.com/cli/latest/userguide/sso-configure-profile-token.html#sso-configure-profile-token-auto-sso). You will need a valid IAM Identity Center profile for this step.

    After this step, you should have a new profile in `~/.aws/config`. The profile name, and the region and sso_account_id fields here are what will later be used to authenticate Docker to your AWS ECR Registry and for other things.

3. Authenticate Docker to your AWS ECR Registry ([link](https://docs.aws.amazon.com/AmazonECR/latest/userguide/registry_auth.html#registry-auth-token))
    ```bash
    aws ecr get-login-password --profile <your-profile> | docker login --username AWS --password-stdin <your-aws-account-id>.dkr.ecr.<your-region>.amazonaws.com
    ```
    
4. Create ECR Repositories for your images if they do not already exist
    ```bash
    aws ecr create-repository --repository-name <repo-name> --profile <your-profile>
    ```
    
5. After building your Docker images (commands for build omitted) tag them for ECR
    ```bash
    docker tag <image-name>:latest <your-aws-account-id>.dkr.ecr.<your-region>.amazonaws.com/<repo-name>:latest
    ```

6. Push your Docker images to ECR
    ```bash
    docker push <your-aws-account-id>.dkr.ecr.<your-region>.amazonaws.com/<repo-name>:latest
    ```

7. As a user with the necessary permissions, create a key pair used to login to the Linux ECS instance securely.
    ```bash
    aws ec2 create-key-pair \
        --key-name <key-name> \
        --key-type rsa \
        --key-format pem \
        --query "KeyMaterial" \
        --output text > <key-name>.pem
    # Set permissions of key to read-only for owner
    chmod 400 <key-name>.pem
    ```
8. As a user with the necessary permissions, create a security group for the instance(s). "Security groups act as a firewall for associated instances, controlling both inbound and outbound traffic at the instance level. You must add rules to a security group that enable you to connect to your instance from your IP address using SSH. You can also add rules that allow inbound and outbound HTTP and HTTPS access from anywhere." ([link](https://docs.aws.amazon.com/AWSECS/latest/UserGuide/get-set-up-for-amazon-ec2.html#create-a-base-security-group))

    Do this through the console following the guide in the link but modifying basic details and inbound rules as makes sense for your use case. For example, you may want to allow SSH access from your IP address only, and allow HTTP and HTTPS access from anywhere.

9. Create an ECS cluster for your images if it doesn't exist.
    ```bash
    aws ecs create-cluster --cluster-name <cluster-name> --region <your-aws-region>
    ```

10. Create [task definitions](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html) for your applications if they don't exist.

11. Register the task definitions.
    ```bash
    aws ecs register-task-definition --cli-input-json file://<path-to-task-definition>.json
    ```