const At = ({target}) => {
    return {
        type: "At",
        target: target
    }
}

const AtAll = () => {
    return {
        type: "AtAll"
    }
}

const Face = ({name, id}) => {
    if (name) {
        return {
            type: "Face",
            name: "bu"
        }
    } else {
        return {
            type: "Face",
            faceId: id || 3
        }
    }
}

const Plain = ({text}) => {
    return {
        type: "Plain",
        text: text
    }
}

const Image = ({imageId, url, path, base64}) => {
    if (imageId) {
        return {
            type: "Image",
            imageId: imageId,
        }
    } else if (path) {
        return {
            type: "Image",
            path: path
        }
    } else if (base64) {
        return {
            type: "Image",
            base64: base64
        }
    } else {
        return {
            type: "Image",
            url: url || "https://i.w3tt.com/2021/09/27/5ibvN.png"
        }
    }
}

const FlashImage = ({imageId, url, path, base64}) => {
    if (imageId) {
        return {
            type: "FlashImage",
            imageId: imageId,
        }
    } else if (path) {
        return {
            type: "FlashImage",
            path: path
        }
    } else if (base64) {
        return {
            type: "FlashImage",
            base64: base64
        }
    } else {
        return {
            type: "FlashImage",
            url: url || "https://i.w3tt.com/2021/09/27/5ibvN.png"
        }
    }
}

const Voice = ({voiceId, url, path, base64}) => {
    if (voiceId) {
        return {
            type: "Voice",
            voiceId: voiceId,
        }
    } else if (path) {
        return {
            type: "Voice",
            path: path
        }
    } else if (base64) {
        return {
            type: "Voice",
            base64: base64
        }
    } else {
        return {
            type: "Voice",
            url: url
        }
    }
}

const Xml = ({xml}) => {
    return {
        type: "Xml",
        xml: xml
    }
}

const Json = ({json}) => {
    return {
        type: "Json",
        json: json
    }
}

const App = ({content}) => {
    return {
        type: "App",
        content: content
    }
}

const Poke = (function () {
    function _({type}) {
        return {
            type: "Poke",
            name: type
        }
    }

    _.Poke = "Poke";
    _.ShowLove = "ShowLove";
    _.Like = "Like";
    _.Heartbroken = "Heartbroken";
    _.SixSixSix = "SixSixSix";
    _.FangDaZhao = "FangDaZhao";
    return _;
})()

const Dice = ({value}) => {
    return {
        type: "Dice",
        value: value || 1
    }
}

/**
 * @param   String  kind         类型
 * @param   String  title        标题
 * @param   String  summary      概括
 * @param   String  jumpUrl      跳转路径
 * @param   String  pictureUrl   封面路径
 * @param   String  musicUrl     音源路径
 * @param   String  brief        简介
 *
 * @returns Object  message
 */
const MusicShare = ({kind, title, summary, jumpUrl, pictureUrl, musicUrl, brief}) => {
    return {
        type: "MusicShare",
        kind: kind,
        title: title,
        summary: summary,
        jumpUrl: jumpUrl,
        pictureUrl: pictureUrl,
        musicUrl: musicUrl,
        brief: brief
    }
}

// const ForwardMessage = () => {
//     return {
//         type: "Forward",
//         nodeList: [
//             {
//                 senderId: 123,
//                 time: 0,
//                 senderName: "sender name",
//                 messageChain: [],
//                 messageId: 123
//             }
//         ]
//     }
// }

const Message = {
    At,
    AtAll,
    Face,
    Plain,
    Image,
    FlashImage,
    Voice,
    Xml,
    Json,
    App,
    Dice,
    MusicShare,
    Poke
}

module.exports = Message;
