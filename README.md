<!--******************************************
 * Copyright (c) 2020 Infiot Inc.
 * All rights reserved.
*********************************************-->

### Assumptions and Prerequisites
1. You are deploying mgmtk8sctrlr in the "infiotmgmtproxy" namespace for the MSP tenant "acme". 
2. You have already created "infiotmgmtproxy" namespace in your k8s cluster.
3. The MSP tenant portal [https://acme.infiot.net] is live.
3. You have created a node-pool dedicated for hosting Infiot's mgmtproxy gateway with following labels and taints
```
Taints:             infiot.com/mgmtproxy=mgmtgw-nodes:NoExecute
                    infiot.com/mgmtproxy=mgmtgw-nodes:NoSchedule
Labels:             infiot.com/mgmtproxy=mgmtgw-nodes
```

### Deploying Infiot's mgmtk8sctrlr

1. Login into the MSP tenant (https://acme.infiot.net) as system administrator and create a token with following privileges.
```
[
  {
    "rap_resource": "",
    "rap_privs": [
      "privTenantRead",
      "privTenantMSP",
      "privSiteCreate",
      "privSiteRead",
      "privSiteWrite",
      "privSiteDelete",
      "privSiteToken",
      "privSiteRestart",
      "privSiteOpsRead",
      "privSiteOpsWrite",
      "privSiteName",
      "privAuditRecordCreate"
    ]
  }
]
```

2. Create or update the secret using following command sequence
```
kubectl -n infiotmgmtproxy delete secret store-mgmtk8sctrlr
kubectl -n infiotmgmtproxy \
    create secret generic store-mgmtk8sctrlr \
    --from-literal=token=<SECRET_FROM_STEP_1> \
    --from-literal=url=https://acme.infiot.net
```

3. Deploy the Traefik load balancer in the "infiotmgmtproxy" namespace

```
kubectl -n infiotmgmtproxy apply -f https://raw.githubusercontent.com/infiotinc/mgmtk8sctrlr/master/traefik-crd.yaml
kubectl -n infiotmgmtproxy apply -f https://raw.githubusercontent.com/infiotinc/mgmtk8sctrlr/master/traefik-deployment.yaml

``` 

4. Create the lan device service configmap

Down the sample configmap and customize as per your requirements
```
wget https://raw.githubusercontent.com/infiotinc/mgmtk8sctrlr/master/mgmtk8sctrlr-config-example.yaml
```
Customize the local copy "mgmtk8sctrlr-config-example.yaml" as per your requirements and apply
```
kubectl -n infiotmgmtproxy apply -f ./mgmtk8sctrlr-config-example.yaml
``` 


5. Deploy the mgmtk8sctrl in the "infiotmgmtproxy" namespace

```
kubectl -n infiotmgmtproxy apply -f https://raw.githubusercontent.com/infiotinc/mgmtk8sctrlr/master/mgmtk8sctrlr-mgmtproxy-deployment.yaml

```
