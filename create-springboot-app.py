#!/usr/bin/env python3

import shutil
import sys
import os

def create_springboot_app(name):
    template_dir = "./template"
    new_project_dir = os.path.join(os.getcwd(), name)

    os.makedirs(new_project_dir, exist_ok=True)
    shutil.copytree(template_dir, new_project_dir, dirs_exist_ok=True)

if __name__ == "__main__":
    create_springboot_app(sys.argv[1])
