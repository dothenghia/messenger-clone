const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const $c = document.getElementsByClassName.bind(document);
const $i = document.getElementById.bind(document);
var indexActive = 0;
const usersAPI = "http://localhost:3000/users";
const messagesAPI = "http://localhost:3000/messages";



            // 1. Render user list /
            // 2. Active item user list /
            // 3. Render user header in chat box /
            // 4. Render chat box message & Border Radius first and last child /
            // 5. Switch to using API / 
            // 6. Post message /
            // 7. CSS the length of message
            // 8. Sort user list (hard)
            // 8. Create option button for message --> Delete message
            // 9. Create option button for user list --> Delete Conversation

function renderData(){
    var getUsersData = new Promise(
        function(resolve){
            fetch(usersAPI)
                .then((response)=>{
                    return response.json();
                })
                .then((data)=>{
                    resolve(data);
                })
        }
    );
    var getMessagesData = new Promise(
        function(resolve){
            fetch(messagesAPI)
                .then((response)=>{
                    return response.json();
                })
                .then((data)=>{
                    resolve(data);
                })
        }
    );

    Promise.all([getUsersData,getMessagesData])
        .then(([userData,messageData])=>{
            const userList = userData.map((user,index)=>{

                var messageArrayOfUser = messageData.filter((mess)=>{
                    return mess.user_id == index+1;
                });
                console.log(messageArrayOfUser);

                if(index == 0){     // Phải cho 1 item được active, nếu ko sẽ bị lỗi null khi active
                                    // NHƯNG MÀ SẼ CÓ BUG KHI POST DATA VÌ RENDER LẠI
                    return `
                    <li class="side-bar__chat-item side-bar__chat-item--active" id="chat-item-${index}">
                        <div class="chat-item--user-icon">
                            <img class="chat-item--user-img" src="${user.image}" alt="">
                        </div>
                        <div class="chat-item--content">
                            <h3 class="chat-item--heading">${user.name}</h3>
                            <div class="chat-item--text">
                                <p class="chat-item--description">Bạn: ${messageArrayOfUser[messageArrayOfUser.length - 1].content}.</p>
                                <span class="chat-item--online">27 phút</span>  
                            </div>
                        </div>
                        <span class="chat-item--sent"><i class="ti-check"></i></span>
                    </li>`;
                }             
                               
                // TẠO ID ĐỂ Onmousedown
                return `
                <li class="side-bar__chat-item" id="chat-item-${index}"> 
                    <div class="chat-item--user-icon">
                            <img class="chat-item--user-img" src="${user.image}" alt="">
                    </div>
                    <div class="chat-item--content">
                        <h3 class="chat-item--heading">${user.name}</h3>
                        <div class="chat-item--text">
                            <p class="chat-item--description">Bạn: ${messageArrayOfUser[messageArrayOfUser.length - 1].content}.</p>
                            <span class="chat-item--online">27 phút</span>  
                        </div>
                    </div>
                    <span class="chat-item--sent"><i class="ti-check"></i></span>
                </li>`;
            });
    
            $(".side-bar__user-list").innerHTML = userList.join('');
    
    
    
            // Render Chat box Header
            $(".chat-box__header--left").innerHTML = 
            `<img class="chat-box_header--user-icon" src="${userData[indexActive].image}" alt="">
            <h3>${userData[indexActive].name}</h3>`;
    
            $(".side-bar__right--user-info").innerHTML =
            `<img src="${userData[indexActive].image}" alt="">
            <h3>${userData[indexActive].name}</h3>`;
    
    
            // Render Message
            var messagesArrayObject = messageData.filter((mess)=>{
                return mess.user_id == indexActive + 1;
            });
    
            var messages = messagesArrayObject.map((mess)=>{
                return `<li class="chat-box__message">
                            <p>${mess.content}</p>
                            <span class="chat-box__message--sent">
                                <i class="ti-check"></i>
                            </span> 
                        </li>`
            });
            $(".chat-box__message-block").innerHTML = messages.join("");

            return [userData,messageData];
        })
        .then(renderActivedData)
};

function renderActivedData ([userData,messageData]){
    // Active Left Side bar Item
    var sideBarLeftChatItems = $$(".side-bar__chat-item");
    sideBarLeftChatItems.forEach((sideBarLeftChatItem,index)=>{
        sideBarLeftChatItem.onmousedown = function(){
            document.getElementById('chat-item-' + index).style.backgroundColor = 'var(--hover-color)';
        }
        sideBarLeftChatItem.onmouseup = function(){
            document.getElementById('chat-item-' + index).style.backgroundColor = '';
            document.querySelector(".side-bar__chat-item.side-bar__chat-item--active").classList.remove("side-bar__chat-item--active");
            this.classList.toggle("side-bar__chat-item--active");
            
            indexActive = index;


            // Update Chat box Header when Active
            $(".chat-box__header--left").innerHTML = 
            `<img class="chat-box_header--user-icon" src="${userData[indexActive].image}" alt="">
            <h3>${userData[indexActive].name}</h3>`;

            $(".side-bar__right--user-info").innerHTML =
            `<img src="${userData[indexActive].image}" alt="">
            <h3>${userData[indexActive].name}</h3>`;


            // Update Chat box Message when Active
            var messagesArrayObject = messageData.filter((mess)=>{
                return mess.user_id == indexActive + 1;
            });
    
            var messages = messagesArrayObject.map((mess)=>{
                return `<li class="chat-box__message">
                            <p>${mess.content}</p>
                            <span class="chat-box__message--sent">
                                <i class="ti-check"></i>
                            </span> 
                        </li>`
            });
            $(".chat-box__message-block").innerHTML = messages.join("");
        }
    });
};

function receiveDataFromInput (){
    var chatBoxSendButton = document.querySelector(".chat-box__send-button");
    var chatBoxInputWrap = document.querySelector(".chat-box__input");
    
    chatBoxSendButton.onclick = function(){
        var chatBoxInput = document.querySelector(".chat-box__input").value;
        
        var inputObject = {
            user_id: indexActive+1,
            content: chatBoxInput
        };
        document.getElementById("chat-box__input").value = '';

        postData(inputObject,function(){
            renderData();
        });

    };

    chatBoxInputWrap.onkeydown = function(e){
        var keycode = e ? e.which : window.event.keyCode;

        if(keycode=='13'){
            var chatBoxInput = document.querySelector(".chat-box__input").value;
        
            var inputObject = {
                user_id: indexActive+1,
                content: chatBoxInput
            };
            document.getElementById("chat-box__input").value = '';

            postData(inputObject,function(lastMessage){
                // Update Side Bar Left after POST Data (avoid Active bug)
                $(".side-bar__chat-item.side-bar__chat-item--active  .chat-item--description").innerHTML =
                `Bạn: ${lastMessage.content}.`;

                $(".side-bar__chat-item.side-bar__chat-item--active  .chat-item--online").innerHTML =
                `Bây giờ`
                
                
                // Update Chat box Message after POST Data
                var li = document.createElement("li");
                li.className = "chat-box__message";
                li.innerHTML = `
                <p>${lastMessage.content}</p>
                <span class="chat-box__message--sent">
                    <i class="ti-check"></i>
                </span> `;

                $("#chat-box__message-block").appendChild(li)
                
                

            });
        }
    }
};

function postData(dataFromInput,callback){
    var options = {
        method : 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(dataFromInput)
    };
    fetch(messagesAPI,options)
        .then((response)=>{
            return response.json();
        })
        .then(callback)
};


function start (){
    renderData();
    receiveDataFromInput();

    
}
    



start();





//========== Side bar RIGHT
const sideBarRightOptions = document.querySelectorAll(".side-bar__right-option--item");
const arrowOptions = document.querySelectorAll(".option--title-arrow");
const sideBarRightSubList = document.querySelector("side-bar__right-option--sub-list");

sideBarRightOptions.forEach((sideBarRightOption) => {

    sideBarRightOption.onclick = function (){
        // document.querySelector(".side-bar__right-option--item.side-bar__right-option--item--active").classList.remove("side-bar__right-option--item--active")

        this.classList.toggle("side-bar__right-option--item--active");

        if(this.classList.contains("side-bar__right-option--item--active")){
            sideBarRightSubList.classList.add("side-bar__right-option--item--active");
        }else{
            sideBarRightSubList.classList.remove("side-bar__right-option--item--active");
        }
    }
})

