# 911Maintenance 

<h3>oracledb install</h3>
help page: https://github.com/oracle/node-oracledb/blob/master/INSTALL.md#instwin
<h5>
requirement: 

<li>python 2.7.x;</li> 
<li>nodejs 4.x;</li> 
<li>instantclient_basic-windows.x64-12.1.0.2.0.zip</li>
<li>instantclient_sdk-windows.x64-12.1.0.2.0.zip</li>
</h5>
<h5>
install steps:
</h5>
<h6>
1. Extract instantclient_basic-windows.x64-12.1.0.2.0.zip and instantclient_sdk-windows.x64-12.1.0.2.0.zip to the same directory. like "C:\oracle\instantclient": 
</h6>
<h6>
2. Make sure that the system environment params have the items
<li>python install directory</li>
<li>instantclient_basic-windows.x64-12.1.0.2.0.zip and instantclient_sdk-windows.x64-12.1.0.2.0.zip extract directory path</li>
</h6>
<h6>
3. use npm went to the app directory, and run the command:<br/><br/>
set OCI_LIB_DIR=C:\oracle\instantclient\sdk\lib\msvc<br/>
set OCI_INC_DIR=C:\oracle\instantclient\sdk\include<br/><br/>

example: <br/>
         
    E:\Museum\Example\Try Self\911Maintenance>set OCI_LIB_DIR=C:\oracle\instantclient\sdk\lib\msvc
         
    E:\Museum\Example\Try Self\911Maintenance>set OCI_INC_DIR=C:\oracle\instantclient\sdk\include
         
    E:\Museum\Example\Try Self\911Maintenance>npm install oracledb
    
</h6>
<h6>
4. run "the npm install oracle" in the app directory, then the oracledb will be installed successfully
</h6>
