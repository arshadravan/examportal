@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    http://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM ----------------------------------------------------------------------------
@REM Maven Wrapper startup script for Windows
@REM
@REM Optional ENV vars
@REM -----------------
@REM   JAVA_HOME - location of a JDK home dir, if not set will use "java" from PATH
@REM   MAVEN_OPTS - parameters passed to the Java VM when running Maven
@REM     e.g. to debug Maven itself, use
@REM       set MAVEN_OPTS=-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=8000
@REM   MAVEN_SKIP_RC - flag to disable loading of mavenrc files
@REM ----------------------------------------------------------------------------

@echo off
@setlocal

set ERROR_CODE=0

@REM To isolate internal variables from possible side effects of the script, 
@REM we use a prefix "MAVEN_BATCH_" for all variables.

@REM Find the project root
set MAVEN_BATCH_ECHO=off
set MAVEN_BATCH_PAUSE=off

@REM Execute a user defined script before this one
if not "%MAVEN_SKIP_RC%" == "" goto skipRcPre
@REM check for pre script, once with legacy name
if exist "%HOME%\mavenrc_pre.bat" call "%HOME%\mavenrc_pre.bat"
if exist "%USERPROFILE%\mavenrc_pre.bat" call "%USERPROFILE%\mavenrc_pre.bat"
:skipRcPre

@REM Begin all vars with MAVEN_BATCH_ to avoid conflicts
set MAVEN_BATCH_APP_HOME=%~dp0
set MAVEN_BATCH_APP_NAME=%~n0

set MAVEN_BATCH_WRAPPER_JAR="%MAVEN_BATCH_APP_HOME%.mvn\wrapper\maven-wrapper.jar"
set MAVEN_BATCH_WRAPPER_PROPERTIES="%MAVEN_BATCH_APP_HOME%.mvn\wrapper\maven-wrapper.properties"
set MAVEN_BATCH_WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain

@REM Find JAVA_HOME
if not "%JAVA_HOME%" == "" goto gotJavaHome
for %%i in (java.exe) do set MAVEN_BATCH_JAVACMD=%%~$PATH:i
if not "%MAVEN_BATCH_JAVACMD%" == "" goto gotJavaCmd

echo.
echo Error: JAVA_HOME not found in your environment. >&2
echo Please set the JAVA_HOME variable in your environment to match the >&2
echo location of your Java installation. >&2
echo.
goto error

:gotJavaHome
set MAVEN_BATCH_JAVACMD=%JAVA_HOME%\bin\java.exe

:gotJavaCmd
if exist "%MAVEN_BATCH_JAVACMD%" goto okJava

echo.
echo Error: JAVA_HOME is set to an invalid directory. >&2
echo JAVA_HOME = "%JAVA_HOME%" >&2
echo Please set the JAVA_HOME variable in your environment to match the >&2
echo location of your Java installation. >&2
echo.
goto error

:okJava
@REM Check if the wrapper jar exists
if exist %MAVEN_BATCH_WRAPPER_JAR% goto run

echo.
echo Error: Could not find %MAVEN_BATCH_WRAPPER_JAR% >&2
echo.
goto error

:run
"%MAVEN_BATCH_JAVACMD%" ^
  %MAVEN_OPTS% ^
  -classpath %MAVEN_BATCH_WRAPPER_JAR% ^
  "-Dmaven.multiModuleProjectDirectory=%MAVEN_BATCH_APP_HOME%" ^
  %MAVEN_BATCH_WRAPPER_LAUNCHER% %*
if ERRORLEVEL 1 goto error
goto end

:error
set ERROR_CODE=1

:end
@endlocal & set ERROR_CODE=%ERROR_CODE%
exit /B %ERROR_CODE%
