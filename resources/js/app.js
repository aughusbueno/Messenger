require('./bootstrap');

class Messenger {
    constructor() {
        this.isRecording = false
        this.blob = ""
        this.blobType = ""
        this.isBlobLoading = false
        this.endpoint = {
            contact : "/api/contacts",
            group : "/api/groups",
            fetchMessage : "/api/messages",
            sendPrivateMessage : "/api/send",
            createGroup : "/api/createGroup",
            searchUser : "/api/search",
            addToGroup : "/api/addtogroup"
        }
        this.currentContact = null
        this.rememberActiveChat = null
        this.message_field = document.querySelector('.message-field')
        this.contactsContainer = document.querySelector('#contact-list')
        this.to_id = document.querySelector('#to_id')
        this.to_group_id = document.querySelector('#to_group_id')
        this.reciever_name = document.querySelector('#reciever_name')
        this.sendMessageForm = document.querySelector('.form-send-message')
        this.messageContainer = document.querySelector('.message-body section')
        this.auth_id = document.querySelector('#auth_id')
        this.audio = document.querySelector("#popup-sound")
        this.send_loader = document.querySelector('.send-loader')
        this.emoji_picker = document.querySelector('#emoji-button')
        this.start_record_btn = document.querySelector('#record-button')
        this.audio_record_result = document.querySelector('#audio-record-result')
        this.remove_recorded_audio = document.querySelector('#remove-recorded-audio')
        this.remove_added_file = document.querySelector('#remove-added-file')
        this.add_files_btn = document.querySelector('#img-button')
        this.hidden_input_file = document.querySelector('.hidden-input-file')
        this.display_attachment = document.querySelector('.add-file-section section')
    }

    ScrollDown() {
        document.querySelector('.messenger-chat').scrollTo(0,document.querySelector('.messenger-chat').scrollHeight);
    }

    TextAreaAutoResize(){
        this.message_field.addEventListener('input', e => {
            if(this.message_field.value.trim() == "") return this.message_field.style.height = '0px'

            this.message_field.style.height = this.message_field.scrollHeight+'px '
        })
    }

    ShowPersonContacts () {
        document.querySelector('#person-contacts').addEventListener('click', event => {
            document.querySelector("#person-contacts").classList.add('border-bottom')
            document.querySelector("#group-contacts").classList.remove('border-bottom')
            this.contactsContainer.innerHTML = `
            <div class="rounded px-3 py-3 placeholder-glow"><div class="d-flex align-items-center"><div class="rounded-circle bg-secondary placeholder p-4 me-2 position-relative"></div><span class="flex-fill"><span><span class="placeholder bg-secondary rounded-pill" style="width:25%"></span> <span class="placeholder bg-secondary rounded-pill" style="width:15%"></span></span> <span class="placeholder bg-secondary rounded-pill w-75"></span></span></div></div><div class="rounded px-3 py-3 placeholder-glow"><div class="d-flex align-items-center"><div class="rounded-circle bg-secondary placeholder p-4 me-2 position-relative"></div><span class="flex-fill"><span><span class="placeholder bg-secondary rounded-pill" style="width:25%"></span> <span class="placeholder bg-secondary rounded-pill" style="width:15%"></span></span> <span class="placeholder bg-secondary rounded-pill w-75"></span></span></div></div><div class="rounded px-3 py-3 placeholder-glow"><div class="d-flex align-items-center"><div class="rounded-circle bg-secondary placeholder p-4 me-2 position-relative"></div><span class="flex-fill"><span><span class="placeholder bg-secondary rounded-pill" style="width:25%"></span> <span class="placeholder bg-secondary rounded-pill" style="width:15%"></span></span> <span class="placeholder bg-secondary rounded-pill w-75"></span></span></div></div>`
            this.DisplayUsers()
            this.currentContact = "person"
        })
    }

    ShowGroupContacts () {
        document.querySelector('#group-contacts').addEventListener('click', event => {
            document.querySelector("#group-contacts").classList.add('border-bottom')
            document.querySelector("#person-contacts").classList.remove('border-bottom')
            this.contactsContainer.innerHTML = `
            <div class="rounded px-3 py-3 placeholder-glow"><div class="d-flex align-items-center"><div class="rounded-circle bg-secondary placeholder p-4 me-2 position-relative"></div><span class="flex-fill"><span><span class="placeholder bg-secondary rounded-pill" style="width:25%"></span> <span class="placeholder bg-secondary rounded-pill" style="width:15%"></span></span> <span class="placeholder bg-secondary rounded-pill w-75"></span></span></div></div><div class="rounded px-3 py-3 placeholder-glow"><div class="d-flex align-items-center"><div class="rounded-circle bg-secondary placeholder p-4 me-2 position-relative"></div><span class="flex-fill"><span><span class="placeholder bg-secondary rounded-pill" style="width:25%"></span> <span class="placeholder bg-secondary rounded-pill" style="width:15%"></span></span> <span class="placeholder bg-secondary rounded-pill w-75"></span></span></div></div><div class="rounded px-3 py-3 placeholder-glow"><div class="d-flex align-items-center"><div class="rounded-circle bg-secondary placeholder p-4 me-2 position-relative"></div><span class="flex-fill"><span><span class="placeholder bg-secondary rounded-pill" style="width:25%"></span> <span class="placeholder bg-secondary rounded-pill" style="width:15%"></span></span> <span class="placeholder bg-secondary rounded-pill w-75"></span></span></div></div>`
            this.DisplayGroup()
            this.currentContact = "group"
        })
    }

    async SearchUser (value) {
        const d = async () => {
            const url = await fetch(this.endpoint.searchUser+"/"+value+"/"+(this.to_group_id.value || 0))
            return await url.json()
        }

        return await d()
    }

    AddToGroup () {
        let element = document.querySelectorAll('#userlist') || undefined
        
        if(!element) return

        let selected = []

        element.forEach(each => each.checked && selected.push(each.value))

        if(!selected.length) return
        let form = new FormData()

        form.append('id', selected)
        form.append('groupid', this.to_group_id.value)
        document.querySelector('#add-group-btn').disabled = true
        fetch(this.endpoint.addToGroup, {
            method : "POST",
            body : form,
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            }
        })
        .then(r => r.json())
        .then(async (d) => {
            if(d.status){
                let result = await this.SearchUser(document.querySelector('#add-group-search-bar').value)
                let temp = ''
                // console.log(result)
                for(const i in result){
                    temp += `
                        <div class="bg-light mb-2 p-2">
                            <div class="form-check">
                                ${result[i].already_added.length == 0 ? `<input class="form-check-input" type="checkbox" value="${result[i].id}" id="userlist">` : ""}
                                <div>
                                    <p class="mb-0">${result[i].name.replace(/</g,"&lt;")}</p>
                                    <small>${result[i].email.replace(/</g,"&lt;")}</small>&nbsp;${result[i].already_added.length == 0 ?"":"<i><small>- Joined in the group.</small></i>"}
                                </div>
                            </div>
                        </div>
                    `
                }
                document.querySelector('.add-group-list-user').innerHTML = temp
                document.querySelector('#add-group-btn').disabled = false
            }
            else{
                document.querySelector('#add-group-btn').disabled = false
                alert("Error Occured. Missing parameters")
            }
        })
    }

    async DisplayMessages(element){
        element.classList.add('bg-light')
        this.rememberActiveChat = `[data-id="${element.dataset.id}"][data-groupid="${element.dataset.groupid}"]`

        if((this.to_id.value.toString() === element.dataset.id.toString()) && (this.to_group_id.value.toString() === element.dataset.groupid.toString())) return
        
        this.reciever_name.textContent = element.dataset.name
        this.to_id.value = element.dataset.id
        this.to_group_id.value = element.dataset.groupid

        this.messageContainer.innerHTML = ''
        this.currentContact == "group" ? document.querySelector("#add-member-btn").classList.remove('d-none') : document.querySelector("#add-member-btn").classList.add('d-none')

        let form = new FormData()

        form.append('message_with', element.dataset.id)
        form.append('message_group', element.dataset.groupid)

        const api = async () => {
            const url = await fetch(this.endpoint.fetchMessage,{
                method : "POST",
                body : form,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            })

            return await url.json()
        }

        const res = await api()
        // console.log(res)
        // add method for update status - inside the update status method will call displayusers method
        res.map((e, i) => {
            
            // ------------------------
            // ---- ATTACHMENTS UI ----
            // ------------------------
            let displayAttachment = ""
         
            if(e.attachment){
                if(e.type.split("/")[0] === "audio") {
                    displayAttachment = `<audio class="mb-2 d-block" controls src='./attachments/${e.attachment}'></audio>`
                }
                else if(e.type.split("/")[0] === "image"){
                    displayAttachment = `<img src="./attachments/${e.attachment}" class="rounded d-block mb-2" style="max-width:300px"/>`
                }
                else if(e.type.split("/")[0] === "video"){
                    displayAttachment = `<video controls src="./attachments/${e.attachment}" class="rounded d-block mb-2" style="max-width:300px">Your browser does not support video tag.</video>`
                }
                else{
                    displayAttachment = `<a download href="./attachments/${e.attachment}" class="bg-light py-2 px-3 rounded-pill d-block mb-2">${e.attachment}</a>`
                }
            }
            // ------------------------
            // ------------------------

            if(e.from_id.toString() === this.auth_id.value.toString()){
                this.messageContainer.innerHTML += `
                <div class="p-2 mb-3">
                    <div class="d-flex justify-content-end">
                        <span>
                            ${displayAttachment}

                            <p class="mb-1 d-flex justify-content-end">
                                <span style="border-radius:30px;" class="bg-primary text-light p-3 text-message shadow-sm">${e.body?e.body.replace(/</g,"&lt;"):"You sent an attachment"}<span>
                            </p>
                            <small class="text-secondary text-end d-block w-100">${new Date(e.created_at).toLocaleString()}</small>
                        </span>
                    </div>
                </div>
                `
            }
            else{
                this.messageContainer.innerHTML += `
                <div class="p-2 mb-3">
                    <div class="d-flex">
                        <span class="me-3">
                            <div class="rounded-circle p-3 bg-light border border-primary"></div>
                        </span>
                        <span style="margin-top:-2em">
                            <small class="text-muted">${e.from_name}</small>
                            ${displayAttachment}
                            <p class="mb-1 d-flex">
                                <span style="border-radius:30px;" class="bg-light text-dark p-3 text-message shadow-sm">${e.body?e.body.replace(/</g,"&lt;"):"Sent an attachment"}<span>
                            </p>
                            <small class="text-secondary">${new Date(e.created_at).toLocaleString()}</small>
                        </span>
                    </div>
                </div>
                `
            }

            this.ScrollDown()
        })
    }

    async DisplayGroup () {

        const api = async () => {
            const url = await fetch(this.endpoint.group)

            return url.json()
        }
        
        const result = await api ()
        // console.log(result)
        let temp = `
        <div class="my-3 input-group px-3">
            <input type="text" class="rounded-pill me-3 form-control" id="create-group-name-field" placeholder="New group chat name..."/>
            <input type="button" class="btn btn-primary" id="create-group-btn" value="Create"/>
        </div>
        `

        if (result.length === 0) {
            this.contactsContainer.innerHTML += `<div class="contact-card rounded px-3 py-2"><div class="text-center text-muted">No Groups found.</div></div>`
        }
        else{
            result.map(e => {
                // console.log(e)
                if(e.length === 0) return
                temp += `
                <div class="contact-card rounded px-3 py-3" data-groupId="${e[0].id}" data-id="0" data-name="${e[0].name.replace(/</g,"&lt;")}">
                    <div class="d-flex align-items-center">
                        <div class="rounded-circle border-primary border p-4 bg-light me-2 position-relative"></div>
                        <span>
                            <small class="fw-bold">${e[0].name.replace(/</g,"&lt;")}</small>
                        </span>
                    </div>
                </div>
                `
            })
        }

        this.contactsContainer.innerHTML = temp

        document.querySelector('#create-group-btn').addEventListener('click', (event) => {
            this.CreateGroup()
        })
        
        const contacts = document.querySelectorAll('.contact-card')

        contacts.forEach(each => {
            each.addEventListener('click', e => {
                contacts.forEach(each1 => each1.classList.remove('bg-light'))
                this.DisplayMessages(each)
                document.querySelector('.add-group-list-user').innerHTML = ""
                // RE CALL CONTACT LIST PARA MAUPDATE UNG SEEN STATUS
            })
        })
        
        if(!this.rememberActiveChat) return
        try{
            document.querySelector('.contact-card'+this.rememberActiveChat).classList.add('bg-light')
        }catch(er){}
    }

    async CreateGroup () {
        let form = new FormData()

        form.append('group_name',document.querySelector('#create-group-name-field').value)

        const send = async () => {
            const url = await fetch(this.endpoint.createGroup,{
                method : "POST",
                body : form,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            })

            return url.json()
        }

        const res = await send()
        if(res.success == true){
            this.DisplayGroup()
            document.querySelector('#create-group-name-field').value= ""
        }
    }

    async DisplayUsers(){
        const api = async () => {
            const url = await fetch(this.endpoint.contact)

            return url.json()
        }

        const result = await api()
        // console.log(result)
        let temp = ''

        if (result.length === 0) return this.contactsContainer.innerHTML = `<div class="contact-card rounded px-3 py-2"><div class="text-center text-muted">No contacts found.</div></div>`

        result.map(e => {
            // console.log(e)
            temp += `
            <div class="contact-card rounded px-3 py-3" data-groupId="0" data-id="${e.userId}" data-name="${e.name.replace(/</g,"&lt;")}">
                <div class="d-flex align-items-center">
                    <div class="rounded-circle border-primary border p-4 bg-light me-2 position-relative">
                        ${ e.active !== 0 ? `<div class="rounded-circle p-2 ms-2 bg-success position-absolute bottom-0"></div>` : ''}
                    </div>
                    <span>
                        <small class="fw-bold">${e.name.replace(/</g,"&lt;")}</small>
                        <small class="text-muted">${e.latest}</small>
                        <small class="d-block text-truncate ${e.userId === e.message[0].from_id && e.message[0].seen === 0?'fw-bold':''}" style="width:280px">${e.userId !== e.message[0].from_id?'You: ':''}${e.message[0].body?e.message[0].body.replace(/</g,"&lt;"):"Sent an attachment"}</small>
                    </span>
                </div>
            </div>
            `
        })

        this.contactsContainer.innerHTML = temp
        const contacts = document.querySelectorAll('.contact-card')

        contacts.forEach(each => {
            each.addEventListener('click', e => {
                contacts.forEach(each1 => each1.classList.remove('bg-light'))
                this.DisplayMessages(each)
                // RE CALL CONTACT LIST PARA MAUPDATE UNG SEEN STATUS
            })
        })
        if(!this.rememberActiveChat) return
        try{
            document.querySelector('.contact-card'+this.rememberActiveChat).classList.add('bg-light')
        }
        catch(err) {}
    }

    PopUpSound () {
        this.audio.play()
    }

    ToastShow () {
        let toastElList = [].slice.call(document.querySelectorAll('.toast'))
        let toastList = toastElList.map(function (toastEl) {
            return new bootstrap.Toast(toastEl)
        })

        toastList.forEach(toast => toast.show());
    }

    ResetAudioBlob () {
        if(this.isRecording){
            this.start_record_btn.click()
        }
        document.querySelector('.audio-record-section').classList.add('d-none')
        this.blob = ""
        this.blobType = ""
    }

    RecordAudio () {
        let device = navigator.mediaDevices.getUserMedia({audio : true})
        let chunks = []
        device.then( stream => {
            let recorder = new MediaRecorder(stream)

            recorder.ondataavailable = async (event) => {
                chunks.push(event.data)

                if(recorder.state === "inactive"){
                    this.isBlobLoading = true
                    const blob = new Blob(chunks, {type: "audio/webm"})

                    this.audio_record_result.src = URL.createObjectURL(blob)
                    this.blob = blob
                    this.blob.lastModifiedDate = new Date();
                    this.blob.name = "fileName";
                    this.blobType = "audio/webm"

                    this.isBlobLoading = false
                    this.start_record_btn.classList.remove('btn-warning')
                    this.start_record_btn.classList.add('btn-outline-primary')
                    document.querySelector('.audio-record-section').classList.remove('d-none')
                    chunks = []
                }
            }
            
            this.start_record_btn.addEventListener('click', event => {
                this.isRecording = !this.isRecording
                if(this.isBlobLoading == true) return

                if(this.isRecording){
                    this.ResetFileBlob()
                    this.start_record_btn.classList.remove('btn-outline-primary')
                    this.start_record_btn.classList.add('btn-warning')
                    document.querySelector('.audio-record-section').classList.add('d-none')
                    recorder.start()
                }
                else{
                    recorder.stop()
                }
            })
        })
        .catch(err => alert("Audio record feature is blocked on this site. Please enable mic to access this feature."))

        this.remove_recorded_audio.addEventListener('click', event => {
            document.querySelector('.audio-record-section').classList.add('d-none')
            this.audio_record_result.src = ""
            chunks = []
        })
    }

    ResetFileBlob () {
        document.querySelector('.add-file-section').classList.add('d-none')
        this.hidden_input_file.value = ""
        this.display_attachment.innerHTML = ""
        this.blob = ""
        this.blobType = ""
    }

    AddFileAttachment () {

        this.add_files_btn.addEventListener('click', event => this.hidden_input_file.click())
        
        this.hidden_input_file.addEventListener('change', event => {

            if(this.isRecording) return alert("Your voice recording is on going ...")
            if(this.isBlobLoading == true) return
            if(!this.hidden_input_file.value) return this.ResetFileBlob()

            this.ResetAudioBlob ()
            this.isBlobLoading = true
            this.blob = this.hidden_input_file.files[0]
            this.blobType = this.blob.type
            const uniformType = this.blobType.split('/')[0]

            if(uniformType === "image"){
                const url = URL.createObjectURL(this.blob)

                this.display_attachment.innerHTML = `<img class="rounded image-upload" src="${url}">`
            }
            else{
                this.display_attachment.innerHTML = `<div class="py-2 px-3 rounded-pill border bg-light">${this.blob.name.replace(/</g,"&lt;")}</div>`
            }

            document.querySelector('.add-file-section').classList.remove('d-none')

            this.isBlobLoading = false
        })

        this.remove_added_file.addEventListener('click', event => this.ResetFileBlob())
    }

    SendMessage () {

        this.sendMessageForm.addEventListener('submit', async (evt) => {
            evt.preventDefault()

            if(this.isRecording) return alert("You are still recording ...")
            if(this.isBlobLoading) return alert("Attachment is still loading ...")
            if((this.blob === "") && (this.message_field.value.trim() === "")) return 
            if((this.to_id.value.trim() === "") && (this.to_group_id.value.trim() === "")) return alert('Reciever is null.')

            let form = new FormData()
            
            form.append('message', this.message_field.value)
            form.append('to', this.to_id.value)
            form.append('group',this.to_group_id.value)
            form.append('timestamp', new Date())
            form.append('attachment', this.blob ? this.blob : "")
            form.append('attachment_type', this.blobType)

            this.send_loader.classList.remove('d-none')

            const send = async () => {
                const url = await fetch(this.endpoint.sendPrivateMessage, {
                    method : "POST", 
                    body : form,
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('.form-send-message input[name=_token]').value,
                    }
                })

                return await url.json()
            }

            const res = await send()
            // console.log(res)
            this.currentContact == "group" ? this.DisplayGroup() : this.DisplayUsers()
            this.send_loader.classList.add('d-none')

            if(!res.success) return alert('Message not sent error occured ...')

            let displayAttachment = ""

            if(this.blob){
                if(this.blobType.split("/")[0] === "audio") {
                    displayAttachment = `<audio class="mb-2 d-block" controls src='./attachments/${res.attachment}'></audio>`
                }
                else if(this.blobType.split("/")[0] === "image"){
                    displayAttachment = `<img src="./attachments/${res.attachment}" class="rounded mb-2 d-block" style="max-width:300px"/>`
                }
                else if(this.blobType.split("/")[0] === "video"){
                    displayAttachment = `<video controls src="./attachments/${res.attachment}" class="rounded d-block mb-2" style="max-width:300px">Your browser does not support video tag.</video>`
                }
                else{
                    displayAttachment = `<a download href="./attachments/${res.attachment}" class="bg-light py-2 px-3 rounded-pill d-block mb-2">${res.attachment}</a>`
                }
            }

            this.messageContainer.innerHTML += `
            <div class="p-2 mb-3">
                <div class="d-flex justify-content-end">
                    <span>
                        ${displayAttachment}

                        <p class="mb-1 d-flex justify-content-end">
                            <span style="border-radius:30px;" class="bg-primary text-light p-3 text-message shadow-sm">${this.message_field.value?this.message_field.value.replace(/</g,"&lt;"):"You sent an attachment"}<span>
                        </p>
                        <small class="text-secondary text-end d-block w-100">${new Date().toLocaleString()}</small>
                    </span>
                </div>
            </div>
            `
            
            this.ResetAudioBlob()
            this.ResetFileBlob()
            this.sendMessageForm.reset()
            this.message_field.style.height = '0px'
            this.message_field.focus()
            this.ScrollDown()
        })
    }

    MessageChannel () {

        /* ---------------------------------------------------- 
        /* If ang reciever id ay equals sa id ko 
        /* ----------------------------------------------------
        /*  -mag nonotif sakin gamit ang bootstrap toast
        /*  -enable sound
        /*  -recall the contact list
        /*
        
        /* ---------------------------------------------------- 
        /* If ang sender id ay equals sa id ko
        /* ---------------------------------------------------- 
        /*  -recall the contact list
        */

        window.Echo.channel('chat_'+this.auth_id.value)
        
        .listen('.message', (e) => {
            if(this.to_id.value.toString() === e.from.toString()){
                let displayAttachment = ""
                
                if(e.attachment){
                    if(e.attachment_type.split("/")[0] === "audio") {
                        displayAttachment = `<audio class="mb-2 d-block" controls src='./attachments/${e.attachment}'></audio>`
                    }
                    else if(e.attachment_type.split("/")[0] === "image"){
                        displayAttachment = `<img src="./attachments/${e.attachment}" class="rounded d-block mb-2" style="max-width:300px"/>`
                    }
                    else if(e.attachment_type.split("/")[0] === "video"){
                        displayAttachment = `<video controls src="./attachments/${e.attachment}" class="rounded d-block mb-2" style="max-width:300px">Your browser does not support video tag.</video>`
                    }
                    else{
                        displayAttachment = `<a download href="./attachments/${e.attachment}" class="bg-light py-2 px-3 rounded-pill d-block mb-2">${e.attachment}</a>`
                    }
                }
                
                this.messageContainer.innerHTML += `
                <div class="p-2 mb-3">
                    <div class="d-flex">
                        <span class="me-3">
                            <div class="rounded-circle p-3 bg-light border border-primary"></div>
                        </span>
                        <span style="margin-top:-2em">
                            <small class="text-muted">${e.from_name}</small>
                            ${displayAttachment}
                            <p class="mb-1 d-flex">
                                <span style="border-radius:30px;" class="bg-light text-dark p-3 text-message shadow-sm">${e.message?e.message.replace(/</g,"&lt;"):"Sent an attachment"}<span>
                            </p>
                            <small class="text-secondary">${new Date(e.timestamp).toLocaleString()}</small>
                        </span>
                    </div>
                </div>
                `
                this.ScrollDown()
                this.currentContact == "group" ? this.DisplayGroup() : this.DisplayUsers()
                return
            }

            JSON.parse(localStorage.getItem('chat-system-notif')) && this.PopUpSound()

            if(e.from.toString() !== this.auth_id.value.toString()){
                this.currentContact == "group" ? this.DisplayGroup() : this.DisplayUsers()

                if(!JSON.parse(localStorage.getItem('chat-system-notif'))) return

                this.ToastShow()
            }
        })
    }

    NotificationSettings () {
        let settings = localStorage.getItem('chat-system-notif')
    
        localStorage.setItem('chat-system-notif', !JSON.parse(settings)+"")
        return !JSON.parse(settings)
    }

    _init(){
        this.TextAreaAutoResize()
        this.DisplayUsers()
        this.SendMessage()
        this.MessageChannel()
        this.RecordAudio()
        this.AddFileAttachment()

        this.ShowGroupContacts()
        this.ShowPersonContacts()

        let picker = new EmojiButton()

        picker.on('emoji',(emoji) => this.message_field.value += emoji)

        this.emoji_picker.addEventListener('click', event => {
            picker.showPicker(this.emoji_picker)
        })

        this.message_field.addEventListener('focus', event => {
            this.start_record_btn.classList.add('d-none')
            this.add_files_btn.classList.add('d-none')
        })

        this.message_field.addEventListener('blur', event => {
            this.start_record_btn.classList.remove('d-none')
            this.add_files_btn.classList.remove('d-none')
        })

        document.querySelector('#add-group-search-bar').addEventListener('input', async(event) => {
            if(event.target.value.length <= 3) return document.querySelector('.add-group-list-user').innerHTML = ''
            let result = await this.SearchUser(event.target.value)
            let temp = ''
            // console.log(result)
            for(const i in result){
                temp += `
                    <div class="bg-light mb-2 p-2">
                        <div class="form-check">
                            ${result[i].already_added.length == 0 ? `<input class="form-check-input" type="checkbox" value="${result[i].id}" id="userlist">` : ""}
                            <div>
                                <p class="mb-0">${result[i].name.replace(/</g,"&lt;")}</p>
                                <small>${result[i].email.replace(/</g,"&lt;")}</small>&nbsp;${result[i].already_added.length == 0 ?"":"<i><small>- Already in the group.</small></i>"}
                            </div>
                        </div>
                    </div>
                `
            }

            document.querySelector('.add-group-list-user').innerHTML = temp
        })

        document.querySelector('#search-contact').addEventListener('input', async (event) => {
            if(event.target.value.length <= 3) {
                document.querySelector('#search-contact-result').innerHTML = ''
                document.querySelector('#search-contact-result').classList.add('d-none')
                return 
            }
            let result = await this.SearchUser(event.target.value)
            let temp = ''
            console.log(result)
            for(const i in result){
                temp += `
                <div class="search-contact-item border rounded p-2 mb-2" style="cursor:pointer" data-groupId="0" data-id="${result[i].id}" data-name="${result[i].name.replace(/</g,"&lt;")}">
                    <p class="mb-0">${result[i].name.replace(/</g,"&lt;")}</p>
                    <small>${result[i].email.replace(/</g,"&lt;")}</small>
                </div>`
            }

            document.querySelector('#search-contact-result').innerHTML = temp
            document.querySelector('#search-contact-result').classList.remove('d-none')

            const contacts = document.querySelectorAll('.search-contact-item')

            contacts.forEach(each => {
                each.addEventListener('click', e => {
                    contacts.forEach(each1 => each1.classList.remove('bg-light'))
                    this.DisplayMessages(each)
                    document.querySelector('#search-contact-result').innerHTML = ''
                    document.querySelector('#search-contact-result').classList.add('d-none')
                })
            })
        })

        document.querySelector('#add-group-btn').addEventListener('click', () => this.AddToGroup())

        if(localStorage.getItem('chat-system-notif') !== null){
            document.querySelector('#notif-settings').checked = JSON.parse(localStorage.getItem('chat-system-notif'))
        }
        else{
            localStorage.setItem('chat-system-notif', "true")
        }

        document.querySelector('#notif-settings').addEventListener('click', (event) => {
            event.target.checked = JSON.parse(this.NotificationSettings())
        })

        // window.addEventListener('keypress', event => {
        //     if(event.code == "Enter") this.SendMessage()
        // })
    }
}

(new Messenger)._init()

const loader = document.querySelector('.loader')

window.addEventListener('load', event => setTimeout(t => loader.classList.add('remove'),1000))

loader.addEventListener('transitionend', event => loader.remove())
