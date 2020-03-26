const generateMsg = (username,text)=>{
    return {
        username,
        text,
        createAt: new Date().getTime()
    }
}

const generateLoc= (username,url)=>{
    return {
        username,
        url,
        createAt :new Date().getTime()
    }
}

module.exports={
    generateMsg:generateMsg,
    generateLoc:generateLoc
}