var fs = require('fs');
var path = require('path');
var child_process = require('child_process');

var rawData = new Buffer("");
var child = null;

TWO_CRLF = '\r\n\r\n';
process.stdin.on("data", function(data) {
    rawData = Buffer.concat([rawData, data]);
    while (true) {
        var contentLength = 0;
        var idx = rawData.indexOf(TWO_CRLF);
        if (idx === -1) break;
        var header = rawData.toString('utf-8', 0, idx);
        var lines = header.split('\r\n');
        for (var i = 0; i < lines.length; i++) {
            var pair = lines[i].split(/: +/);
            if (pair[0] == 'Content-Length') {
                contentLength = parseInt(pair[1]);
            }
        }
        var bot = idx + 4;
        var top = bot + contentLength;
        if (top > rawData.length) break;
        var msg = JSON.parse(rawData.toString('utf-8', bot, top));
        rawData = rawData.slice(top);

        try {
            process_message(msg);
        } catch (exc) {
            send("response", {
                request_seq: msg.seq,
                success: false,
                command: msg.command,
                message: "Error in debugger occured when responding to '"+ msg.command +"'\n"
            })
            send("event", {
                event: "output",
                body: {
                    // categore: 'console', 'stdout', 'stderr', 'telemetry?'
                    category: 'stderr',
                    output: "Received request\n" + JSON.stringify(msg) + "\n" +
                            exc + "\n"
                }
            })

        }
    }
});

//process.stdout
//var output = process.env;
//fs.writeFileSync("/home/cheery/test-env", JSON.stringify(output), "utf8");

// The best documentation for doing this so far:
// https://github.com/Microsoft/vscode-debugadapter-node/blob/master/protocol/src/debugProtocol.ts
// Apparently they thought nobody cares about their protocol. Well..
// That was perhaps true until now.
function process_message(msg) {
    if (msg.type == "request" && msg.command == "initialize") {
        var config = msg.arguments;
        // columnsStartAt1, linesStartAt1, adapterId="lever", pathFormat="path"?
        return send("response", {
            request_seq: msg.seq,
            success: true,
            command: "initialize",
            body: {
                supportsConditionalBreakpoints: false,
                supportsFunctionBreakpoints: false,
                supportsConfigurationDoneRequest: false,
                supportsEvaluateForHovers: false,
                supportsStepBack: false,
                supportsSetVariable: false,
                supportsRestartFrame: false,
                supportsStepInTargetsRequest: false,
                supportsGotoTargetsRequest: false,
                supportsCompletionRequest: false
            }
        });
    }
    else if (msg.type == "request" && msg.command == "launch") {
        var args = msg.arguments.args;
        if (args === null || args === undefined) args = [];
        var program = msg.arguments.program;
        var lever_path = msg.arguments.lever_path;
        var exe = get_executable_path(lever_path);
        process.env['LEVER_PATH'] = lever_path;
        child = child_process.spawn(exe, [program].concat(args));
        child.stdout.setEncoding('utf8');
        child.stdout.on('data', function(data){
            send("event", {event:"output", body:{category:'stdout', output:data}});
        });
        child.stderr.setEncoding('utf8');
        child.stderr.on('data', function(data){
            send("event", {event:"output", body:{category:'stderr', output:data}});
        });
        child.on('close', function(status){
            send("event", {event:"terminated", body:{restart:false}});
        });
        return sendResponse(msg, {});
    } else if (msg.type == "request" && msg.command == "disconnect") {
        if (child != null) {
            child.kill();
            child = null;
        }
        return sendResponse(msg, {});
    }

    log("unhandled debugger request\n" + JSON.stringify(msg) + "\n");
    send("response", {
        request_seq: msg.seq,
        success: false,
        command: msg.command,
        message: "Unfortunately '"+ msg.command +"' -feature not yet handled\n"
    });
}

function sendResponse(request, body) {
    return send("response", {
        request_seq: request.seq,
        command: request.command,
        success: true,
        body: body
    });
}

function log(msg) {
    send("event", {
        event: "output",
        body: {
            category: 'console', // categore: 'console', 'stdout', 'stderr', 'telemetry?'
            output: msg
        }
    })
}

var sequence = 1;
function send(typ, msg) {
    msg.type = typ;
    msg.seq = sequence++;
    var data = JSON.stringify(msg);
    head = 'Content-Length: ' + Buffer.byteLength(data, 'utf8');
    process.stdout.write(head + TWO_CRLF + data);
}


function get_executable_path(lever_path) {
    switch (process.platform) {
        case "win32": return path.join(lever_path, "lever.exe");
        default:      return path.join(lever_path, "lever");
    }
}