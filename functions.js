function include(filename){
    return HtmlService.createTemplateFromFile(filename).evaluate().getContent()
}

function getPageUrl(page){
    let url = ScriptApp.getService().getUrl().replace("/dev", "/exec")
    if (page){
        url += "?p=" + page
    }
    return url
}


function createFile({data, type, name}, folder){
    data = Utilities.base64Decode(data)
    const blob = Utilities.newBlob(data, type, name)
    const file = folder.createFile(blob)
    return file
}


function getFolderByName(name){
    const id = SpreadsheetApp.getActive().getId()
    const parentFolder = DriveApp.getFileById(id).getParents().next()
    const folders = parentFolder.getFoldersByName(name)
    let folder
    if (folders.hasNext()){
        folder = folders.next()
    }else{
        folder = parentFolder.createFolder(name)
    }
    return folder
}

// create token
function createToken(key){
    let token = 'key-' + Utilities.getUuid() + '-afei'
    let cache = CacheService.getScriptCache()
    let expirationInSeconds = 60 * 60 * 6
    cache.put(key, token, expirationInSeconds)
    return token
}

// save password
function savePassword(key, password){
    let encodedPassword = encodePassword(password)
    let props = PropertiesService.getDocumentProperties()
    props.setProperty(key, encodedPassword)
}


// get password from document properties
function getPassword(key){
    let props = PropertiesService.getDocumentProperties()
    let password = props.getProperty(key)
    if (password){
        password = decodePassword(password)
    }
    return password
}

// encode password
function encodePassword(password){
    let encoded = Utilities.base64Encode(password)
    return encoded
}

// decode password
function decodePassword(encoded){
    let data = Utilities.base64Decode(encoded)
    let decoded = Utilities.newBlob(data).getDataAsString()
    return decoded
}

//send invitation email
function sendInvitationEmail(email, role, code){
    let subject = "Invitation Approal Workflow Team"
    let body = ''
    let url = getPageUrl()
    let htmlBody = `<table width="100%" cellpadding="0" cellspacing="0"><tr>
        <td width="auto"><\/td>
        <td width="600px" style="padding: 24px; background: #eee;">
            <h1>Invitation<\/h1>
            <p>You were invited as the <b>${role}<\/b> user, please <a href="${url}" style="color: #4DB6AC">
                sign up<\/a> with your email and the below invitation code.<\/p>
            
            <p style="margin: 13px 0px; 
                text-align:center; 
                background: #4DB6AC; 
                letter-spacing: 24px;  
                padding: 24px; 
                font-size: 70px;
                font-weight: bold;
                color: #fff;">${code}<\/p>
            
            <p>Thanks & BR,<br>Approval Workflow Team<\/p>
        <\/td>
        <td width="auto"><\/td><\/table>`
    let options = {
        htmlBody,
    }
    GmailApp.sendEmail(email, subject, body, options)
}


function render(page, title, data){
    const template = HtmlService.createTemplateFromFile(page)
    template.data = data
    let html = template
        .evaluate()
        .setTitle(title)
        .addMetaTag("viewport", "width=device-width, initial-scale=1")
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    return html
}