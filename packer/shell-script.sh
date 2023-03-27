#!/bin/bash
sleep 30
export DEBIAN_FRONTEND=noninteractive
export CHECKPOINT_DISABLE=1

#Update yum
echo "================================="
echo "Updating yum dependencies"
echo "================================="
sudo yum update -y
sudo yum upgrade -y

# Setup Node 
echo "================================="
echo "Setting Node and npm"
echo "================================="
curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash -
sudo yum install -y nodejs

# Install cloudwatch agent
echo "================================="
echo "Installing cloudwatch"
echo "================================="
sudo yum install amazon-cloudwatch-agent -y 

# Start cloudwatch agent
echo "================================="
echo "Configuring cloudwatch"
echo "================================="
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
-a fetch-config \
-m ec2 \
-c file:/home/ec2-user/webapp/api/cloudwatch/config.json \
-s

# Installing and launching application
echo "================================="
echo "Installing dependencies and launching application"
echo "================================="
mkdir ~/webapp
unzip /tmp/webapp.zip -d ~/webapp/
(cd /home/ec2-user/webapp/ && npm install)

# Setting up systemd
echo "================================="
echo "Setting up Systemd"
echo "================================="
sudo mv /tmp/nodeapp.service /etc/systemd/system/nodeapp.service
sudo systemctl enable nodeapp.service
sudo systemctl start nodeapp.service

echo "~~~~~~~ ALL DONE ~~~~~~~~"