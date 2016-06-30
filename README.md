# 911Maintenance 

### 1. Introduction
This is a common tools for the hardware, oracle database, services and resource usage inspections. 
Implement custom server configurations. It use the NodeJs to build all the features, 
that will make the server business logic running in the async mode

Anyway this is a simple tools, so it didn't have any data storage features, but in the future maybe it will have
some documents manage feature etc.

### 2. Dependencies Detail
To implement these features we use some third-party packages or official packages.like:

- oracledb(Official)
- simple-ssh
- wmi-client

We use oracledb to implement oracle database inspections, but we only use very simple features in this 
package.by the way to install oracledb package, there has some official documents. if you don't understand,
we will introduce how to install oracledb step by step.

All the features we implement are all use the above packages, so next we will introduce some important package
 install progress.

### 3. Package installation
Because of oracledb requires some environment dependencies, so next we only introduce how to install oracledb.

First there has a official document to introduce how to install, link <https://github.com/oracle/node-oracledb/blob/master/INSTALL.md#instwin>
if you don't understand this document, next i will publish how to.

oracledb has some environment requires, if not will cause the installation failed, the following are the requirements of oracledb:

- python 2.7.x
- nodejs 4.x or later
- instantclient_basic-windows.x64-12.1.0.2.0.zip
- instantclient_sdk-windows.x64-12.1.0.2.0.zip

if you get these requirements ready, next let us to install the oracledb package, the following are installation steps:

1. Extract instantclient_basic-windows.x64-12.1.0.2.0.zip and instantclient_sdk-windows.x64-12.1.0.2.0.zip to the same directory. like "C:\oracle\instantclient"
2. Make sure that the system environment params have the items:
    - python install directory
    - instantclient_basic-windows.x64-12.1.0.2.0.zip and instantclient_sdk-windows.x64-12.1.0.2.0.zip extract directory path.
3. use npm went to the app directory, and run the command:
    - set OCI_LIB_DIR=C:\oracle\instantclient\sdk\lib\msvc
    - set OCI_INC_DIR=C:\oracle\instantclient\sdk\include
   
    example:
            
          E:\Museum\Example\Try Self\911Maintenance>set OCI_LIB_DIR=C:\oracle\instantclient\sdk\lib\msvc
            
          E:\Museum\Example\Try Self\911Maintenance>set OCI_INC_DIR=C:\oracle\instantclient\sdk\include
            
          E:\Museum\Example\Try Self\911Maintenance>npm install oracledb

4. run "npm install oracle" in the app directory, then the oracledb will be installed successfully

then we can use node to connect oracle database and complete writing our business logic

### 4. Feature Introduction
We use configuration to put what we want to inspection, all the configuration can put in the **server\configs\center_inspections** directory.
through center name to create a new json file and make the inspection configuration in it.So that when we want to run a center inspection, we can
define a center name in the request params and the server will compare the configuration file from the center name. And then give you a right inspection
results by your center passing. In this way we don't care how to build a inspection group or items, we access and build inspection items automatic.
So you needn't to writing another code manually. It make easy that coding simple and dependency the configuration you want.



