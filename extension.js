// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    //console.log("Activating lever tools");
    //process.env["LEVER_PATH"] = vscode.workspace.getConfiguration("lever").get("runtime_path");
    //vscode.window.showInformationMessage("lever path set to: " + process.env["LEVER_PATH"]);

    //var disposable = vscode.workspace.onDidChangeConfiguration(function() {
    //    process.env.LEVER_PATH = vscode.workspace.getConfiguration("lever").get("runtime_path");
    //    vscode.window.showInformationMessage("lever path set to: " + process.env["LEVER_PATH"]);
    //});
    //context.subscriptions.push(disposable);
    
    //console.log("LEVER_PATH set to vscode.env");
    //process.env["LEVER_PATH"] = vscode.workspace.getConfiguration("lever.path");

    /*var disposable = new languageclient.LanguageClient("Lever", {
        run: {

        },
        debug: {
            
        }
    },
    {
        documentSelector: ['lever'],
        synchronize: {
            configurationSection: "lever",
            fileEvents: vscode.workspace.createFileSystemWatcher('*.lc')
        }
    }).start();
    context.subscriptions.push(disposable);*/
    
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    /*console.log('Congratulations, your extension "vscode-lever" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    var disposable = vscode.commands.registerCommand('extension.getLeverPath', function () {
        var conf = vscode.workspace.getConfiguration("lever");
        // Display a message box to the user
        vscode.window.showInformationMessage(conf.get("path"));
        return conf.get("path");
    });
    context.subscriptions.push(disposable);

    vscode.languages.register
*/
    var disposable = vscode.commands.registerCommand('extension.getLeverRuntimePath', function() {
        return vscode.workspace.getConfiguration("lever").get("runtime_path");
    })
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;