# Lab 5: Ajax and REST

The purpose of this lab is to get some practice writing Ajax calls.  It also illustrates a simple use of sessions.

The starter code is a simple example of a chat server, with parts of the code borrowed from a [tutorial](https://code.tutsplus.com/tutorials/how-to-create-a-simple-web-based-chat-application--net-5931).  I used the CSS from the original, and it is *very* outdated and poor by modern standards, so please don't use it as an example.  You are welcome to rewrite it, but that isn't part of the lab.

### Getting started

`npm install`

You won't be able to successfully run the server at first, because some code is missing.


### Sessions, Ajax, REST

In `chatserver.js` you will see the use of `cookieParser` and `session` to create and initialize a session. The cookie will be sent with every response, and the browser will send it back to the server.  

In `setName`, we add a field to the session called `name`.  We can now use this to keep track of the user's name across operation and page reloads.

#### Task 1

Fill in the body of `getName` in `chatserver.js` so that it returns a JSON object with one key value pair.  "name" is the key, and the value is the empty string if `name` is undefined in the session, or the value of the `name` field in the session object.

#### Task 2

To complete the implementation of displaying the name, complete the `getName` function in `script.js`.

Now you should be able to try out the chat server and enter a nickname.

#### Task 3

Complete the callback function for the "Send" button that sends a message to the server.  You will need to see what the server function is expecting to receive so that you can POST it correctly.  You will also need to extract the username and message from the appropriate HTML elements.

Once you have your code working, try running it using two different browsers so that you can see what happens when two sessions are running simultaneously.  You can also try connecting to your friend's chat server if you are running on the lab machines.  You will need to know the name of the lab machine you are sitting in front of, which you can find out by running `hostname`.

For example, if `hostname` prints `b3175-05`, and I'm running a server on port 3000, then you can point your browser at `http://b3175-05.teach.cs.toronto.edu:3000` to connect to it.


### Optional Extensions

 - Add a time stamp to each message.
 - Limit the length of messages, or implement wrapping in the chat box.
 - Display only the last N messages or implement scrolling the chat box.

### Discussion 

There is a noticeable lag between updates of the message list.  We could improve that a bit by calling `buildMessages` in the callback to posting a message.  We could also improve it by polling more frequently, but this will increase network traffic and load on the server.

A modern way to handle this is to use [sockets](http://socket.io/get-started/chat/) for bi-directional communication.
This allows the server to send messages to the client without the client polling.  There are lots of examples of chat servers implemented using socket.io on the internet.

However, the polling model is one that you will see frequently, and it is worth understanding the basics of Ajax requests in this kind of example.



