
$(document).ready(function(){
        $('#wrapper').height($(document).height());
        // I only have one form on the page but you can be more specific if need be.
        var $form = $('form');

        if ( $form.length > 0 ) {
                $('form input[type="submit"]').bind('click', function ( event ) {
                if ( event ) event.preventDefault();
                // validate_input() is a validation function I wrote, you'll have to substitute this with your own.
                if ( $form.validate() ) { register($form); }
                });
        }
        var dappContactAddress;
        var serialNumber;
        var NebPay
        var nebPay
        var nebulas
        var name
        dappContactAddress = "n1vNgLrP89f2k8tave2efUiNUSdHYZEmgUD";
        nebulas = require("nebulas"), neb = new nebulas.Neb();
        neb.setRequest(new nebulas.HttpRequest("https://testnet.nebulas.io"));
    
        NebPay = require("nebpay");     //https://github.com/nebulasio/nebPay
        nebPay = new NebPay();
        var myneb = new Neb();
        var nasApi = myneb.api;	
    
        var curWallectAdd;

        var oMain = new CMain({
        scope_accelleration:2,    //SCOPE ACCELLERATION
        scope_friction:0.85,      //SCOPE FRICTION
        max_scope_speed:40,       //MAXIMUM SCOPE SPEED
        num_bullets:3,            //NUMBER OF PLAYER BULLETS FOR EACH SHOT LEVEL
        hit_score: 100,           //POINTS GAINED WHEN DUCK IS HITTEN
        bonus_time:4000,          //BONUS TIME IN MILLISECONDS
        lives:4,                  //NUMBER OF PLAYER LIVES
        duck_increase_speed: 0.5, //INCREASE THIS VALUE TO SPEED UP DUCKS AFTER EACH LEVEL SHOT
        duck_occurence: [ 1,  //NUMBER OF DUCKS IN SHOT 1
                                1,  //NUMBER OF DUCKS IN SHOT 2
                                1,  //NUMBER OF DUCKS IN SHOT 3
                                1,  //NUMBER OF DUCKS IN SHOT 4
                                1,  //NUMBER OF DUCKS IN SHOT 5
                                2,  //NUMBER OF DUCKS IN SHOT 6
                                2,  //NUMBER OF DUCKS IN SHOT 7
                                2,  //NUMBER OF DUCKS IN SHOT 8
                                2,  //NUMBER OF DUCKS IN SHOT 9
                                3   //NUMBER OF DUCKS IN SHOT 10
                                //ADD NEW DUCK OCCURENCE HERE IF YOU NEED...
                        ]
        });

        getWallectInfo();
        getAllInfo();

        function getWallectInfo() {
                console.log("getWallectInfo");
                window.addEventListener('message', getMessage);
            
                window.postMessage({
                    "target": "contentscript",
                    "data": {},
                    "method": "getAccount",
                }, "*");
            }
            
            function getMessage(e){
                if (e.data && e.data.data) {
                    console.log("e.data.data:", e.data.data)
                    if (e.data.data.account) {
                        var address = e.data.data.account;
                        curWallectAdd = address;
                        console.log("address="+address);
                    }
                }
               
            }

        $(oMain).on("game_start", function(evt) {
                // alert("game_start");
                // bootbox.prompt("输入您的游戏昵称，这个昵称会在游戏结束时一并提交到星云链中", function(result){
                //         console.log(result); 
                //         if(result !== null && result !== ""){
                //            name = value;
                //         }else{
                //            alert('你取消了输入或者输入为空！请再来一次~');      
                //         }
                // });

                value = prompt('输入您的游戏昵称，这个昵称会在游戏结束时一并提交到星云链中\n您的地址为：' + curWallectAdd, '游客玩家');  
                if(value == null){  
                        alert('你取消了输入！再来一次~');  
                        window.location.reload()
                }else if(value == ''){  
                        alert('姓名输入为空，请重新输入！');  
                        window.location.reload()
                }else{  
                        alert('你好'+ value + ", 请点击确定开始游戏");  
                        // updatePlayName(value);
                        name = value;
                }  
        });

        $(oMain).on("save_score", function(evt,iScore) {
                alert(name + "您的得分为: "+iScore + "，请确认上链受人膜拜~");
                updatePlayScore(name,iScore)
        });

        $(oMain).on("restart", function(evt) {
                alert("restart");
        });
        function updatePlayName(name){
                var to = dappContactAddress;
                var value = "0";
                var callFunction = "updatePlayName";
                var callArgs = "[\"" + name + "\"]";
                console.log(callArgs);
                serialNumber = nebPay.call(to, value, callFunction, callArgs, {    //使用nebpay的call接口去调用合约,
                        listener: function (resp) {
                                console.log("thecallback is " + resp)
                        }
                });
        }
            
        function updatePlayScore(name, score){
                var to = dappContactAddress;
                var value = "0";
                var callFunction = "updatePlayScore";
                var callArgs = "[\"" + name + "\",\"" + score + "\"]";
                console.log(callArgs);
                serialNumber = nebPay.call(to, value, callFunction, callArgs, {    //使用nebpay的call接口去调用合约,
                        listener: function (resp) {
                                console.log("thecallback is " + resp)
                        }
                }); 
        }
            
        function getAllInfo(){
                var from = dappContactAddress;
                var value = "0";
                var nonce = "0";
                var gas_price = "1000000";
                var gas_limit = "20000000";
                var callFunction = "getPlayersInfo";
                var callArgs = "";
                //console.log("callFunction:" + callFunction + " callArgs:" + callArgs);
                var contract = {
                "function": callFunction,
                "args": callArgs
                };
                neb.api.call(from, dappContactAddress, value, nonce, gas_price, gas_limit, contract).then(function (resp) {
                var result = resp.result;   
                console.log("result : " + result);
                result = JSON.parse(result);
                var html = "";
                                var itemList = result;
                                console.log(itemList);
                for(var i = 0, iLen = itemList.length; i < iLen; i++) {
                        html += '<li>' +
                                        '<p class="item-content"><font color="red">玩家：'+ itemList[i].from + '<br>分数：' + itemList[i].score + '<br>昵称：' + itemList[i].name + '</font></p>' +
                                                        '</li>';
                                                        console.log(html);
                }
                $('#itemList').append(html);
                }).catch(function (err) {
                console.log("error :" + err.message);
                })
            
                // getPlayersInfo()
        }
});