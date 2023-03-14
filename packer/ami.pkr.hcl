variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "ssh_username" {
  type    = string
  default = "ec2-user"
}

variable "demo_account_id" {
  type    = string
  default = "377562592179"
}

variable "dev_account_id" {
  type    = string
  default = "085379417628"
}

packer {
  required_plugins {
    amazon = {
      version = " >= 1.0.8"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

# Source block
source "amazon-ebs" "nodeapp-ami" {
  region          = "${var.aws_region}"
  ssh_username    = "${var.ssh_username}"
  ami_name        = "NodeApp_${formatdate("YYYYMMDDhhmmss", timestamp())}"
  ami_description = "AMI for Node App"
  ami_regions = [
    "${var.aws_region}"
  ]
  ami_users = ["${var.demo_account_id}", "${var.dev_account_id}"]

  aws_polling {
    delay_seconds = 120
    max_attempts  = 50
  }

  source_ami_filter {
    filters = {
      virtualization-type = "hvm"
      name                = "amzn2-ami-kernel-5.*.0-x86_64-gp2"
      root-device-type = "ebs"
    }
    owners      = ["amazon"]
    most_recent = true
  }
  instance_type = "t2.micro"

  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/xvda"
    volume_size           = 8
    volume_type           = "gp2"
  }
}

build {
  sources = ["source.amazon-ebs.nodeapp-ami"]

  provisioner "file" {
    source      = "./webapp.zip"
    destination = "/tmp/"
  }

  provisioner "file" {
    source      = "./packer/nodeapp.service"
    destination = "/tmp/nodeapp.service"
  }

  provisioner "shell" {
    script = "./packer/shell-script.sh"
  }
}
