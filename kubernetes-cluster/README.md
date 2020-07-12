set hostname

configure timezone

add xaas mirror

---

```ini
[all:vars]
ansible_user=kube
ansible_password=changeme
ansible_sudo_pass=changeme
ansible_python_interpreter=/usr/bin/python3

[managers]
manager ansible_host=192.168.1.14

[nodes]
node1 ansible_host=192.168.1.16
node2 ansible_host=192.168.1.17
```

---

add fingerprints

---

ansible all -m ping

---

ansible-playbook dependencies.yml

ansible-playbook manager.yml

ansible-playbook nodes.yml
