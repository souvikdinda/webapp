#!/bin/bash
sleep 30
export DEBIAN_FRONTEND=noninteractive
export CHECKPOINT_DISABLE=1

#Update yum
echo "================================="
echo "Updating yum dependencies"
echo "================================="
sudo yum update -y

# Setup Node 
echo "================================="
echo "Setting Node and npm"
echo "================================="
curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash -
sudo yum install -y nodejs

# Setup MySQL server
echo "================================="
echo "Installing MySQL"
echo "================================="
sudo yum install https://dev.mysql.com/get/mysql80-community-release-el7-5.noarch.rpm -y
sudo yum install mysql-community-server -y
echo "Staring and enabling service"
sudo systemctl start mysqld
sudo systemctl enable mysqld

# Updating password for root and app user and creating database
echo "Creating database and changing password for root and app user"
tempDBPass="`sudo grep 'temporary.*root@localhost' /var/log/mysqld.log | tail -n 1 | sed 's/.*root@localhost: //'`"
mysql -u root --password=$tempDBPass --connect-expired-password -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'Sourish@1';CREATE USER 'souvik'@'localhost' IDENTIFIED BY 'Sourish@1';GRANT ALL PRIVILEGES ON *.* TO 'souvik'@'localhost';FLUSH PRIVILEGES;CREATE SCHEMA csye6225;"

# Installing and launching application
echo "================================="
echo "Installing dependencies and launching application"
echo "================================="
mkdir ~/webapp
unzip /tmp/webapp.zip -d ~/webapp/
touch /home/ec2-user/webapp/.env
echo -e "PORT=8080\nDB_HOSTNAME=127.0.0.1\nDB_PORT=3306\nDB_USERNAME=souvik\nDB_PASSWORD=Sourish@1\nDB_DBNAME=csye6225" > /home/ec2-user/webapp/.env
(cd /home/ec2-user/webapp/ && npm install)

# Setting up systemd
echo "================================="
echo "Setting up Systemd"
echo "================================="
sudo mv /tmp/nodeapp.service /etc/systemd/system/nodeapp.service
sudo systemctl enable nodeapp.service
sudo systemctl start nodeapp.service

echo "~~~~~~~ ALL DONE ~~~~~~~~"