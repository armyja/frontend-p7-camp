<template>
  <div class="container max-w-3xl mx-auto mt-60">
    <!--  rooms -->
    {{ state.listOfRooms }}
    <el-form ref="form" :model="form" label-width="80px" @submit.prevent>
      <el-form-item label="房间名称">
        <el-input v-model="form.roomid"></el-input>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="form.userFullName"></el-input>
      </el-form-item>
      <el-form-item label="私人房间">
        <el-switch v-model="form.hidden"></el-switch>
      </el-form-item>
      <el-form-item label="房间密码">
        <el-input v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="openRoom">创建房间</el-button>
        <el-button @click="joinRoom">加入房间</el-button>
      </el-form-item>
    </el-form>
    <canvas id="temp-stream-canvas" style="display: none"></canvas>
    {{ state.names }}
    <Chat
      :names="state.names"
      :conversation="state.conversation"
      @append-message="handleMessage"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { ElMessageBox } from 'element-plus';
declare const window: Window & {
  CanvasDesigner: any;
  RTCMultiConnection: any;
  tempStream: any;
};
interface ConversationValue {
  user: string;
  checkmark: string;
  data: string;
  received: boolean;
}
export default defineComponent({
  name: 'Home',
  setup() {
    const state = reactive({
      listOfRooms: [],
      names: [] as Array<string>,
      conversation: [] as Array<ConversationValue>
    });
    const params = ref({
      sessionid: '',
      password: '',
      open: false,
      userFullName: '',
      publicRoomIdentifier: ''
    });
    const showMainVideo = ref(false);
    const typingHint = ref('');
    return {
      showMainVideo,
      typingHint,
      state,
      params
    };
  },
  data() {
    return {
      form: {
        roomid: '',
        userFullName: '',
        hidden: false,
        connection: null,
        roomConnection: null,
        password: ''
      }
    };
  },
  mounted() {
    let that = this;
    let RTCMultiConnection = window.RTCMultiConnection;
    // this object is used to get uniquie rooms based on this demo
    // i.e. only those rooms that are created on this page
    let publicRoomIdentifier = 'dashboard';

    let connection = new RTCMultiConnection();
    this.roomConnection = connection;

    connection.socketURL = '/';

    /// make this room public
    connection.publicRoomIdentifier = publicRoomIdentifier;
    connection.socketMessageEvent = publicRoomIdentifier;

    // keep room opened even if owner leaves
    connection.autoCloseEntireSession = true;

    connection.connectSocket(function (socket: {
      on: (arg0: string, arg1: () => void) => void;
    }) {
      looper();

      socket.on('disconnect', function () {
        // location.reload();
      });
    });

    function looper() {
      // if (!$('#rooms-list').length) return;
      connection.socket.emit(
        'get-public-rooms',
        publicRoomIdentifier,
        function (listOfRooms: any) {
          // updateListOfRooms(listOfRooms);
          that.state.listOfRooms = listOfRooms;

          setTimeout(looper, 3000);
        }
      );
    }
  },
  methods: {
    initConnection() {
      let that = this;
            let params = this.params;
      params.userFullName = this.form.userFullName;
      params.sessionid = this.form.roomid;
      params.password = this.form.password;

      let connection = new RTCMultiConnection();
      this.connection = connection;

      connection.socketURL = '/';
      connection.publicRoomIdentifier = "dashboard";
      connection.socketMessageEvent = 'canvas-dashboard-demo';
      connection.autoCloseEntireSession = true;
      connection.maxParticipantsAllowed = 1000;

      let CanvasDesigner = window.CanvasDesigner;
      var designer = new CanvasDesigner();

      // you can place widget.html anywhere
      designer.widgetHtmlURL =
        'https://cdn.jsdelivr.net/npm/canvas-designer@1.3.0/widget.html';
      designer.widgetJsURL =
        'https://cdn.jsdelivr.net/npm/canvas-designer@1.3.0/widget.min.js';

      designer.addSyncListener(function (data: string) {
        connection.send(data);
      });

      designer.setSelected('pencil');

      designer.setTools({
        pencil: true,
        text: true,
        image: true,
        pdf: true,
        eraser: true,
        line: true,
        arrow: true,
        dragSingle: true,
        dragMultiple: true,
        arc: true,
        rectangle: true,
        quadratic: false,
        bezier: true,
        marker: true,
        zoom: false,
        lineWidth: false,
        colorsPicker: false,
        extraOptions: false,
        code: false,
        undo: true
      });

      // here goes RTCMultiConnection

      connection.chunkSize = 16000;
      connection.enableFileSharing = true;

      connection.session = {
        audio: true,
        video: true,
        data: true
      };
      connection.sdpConstraints.mandatory = {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true
      };

      connection.onUserStatusChanged = this.onUserStatusChanged;

      connection.onopen = function () {
        connection.onUserStatusChanged();

        if (designer.pointsLength <= 0) {
          // make sure that remote user gets all drawings synced.
          setTimeout(function () {
            connection.send('plz-sync-points');
          }, 1000);
        }

        // document.getElementById('btn-chat-message').disabled = false;
        // document.getElementById('btn-attach-file').style.display = 'inline-block';
        // document.getElementById('btn-share-screen').style.display = 'inline-block';
      };

      connection.onclose =
        connection.onerror =
        connection.onleave =
          function (event: any) {
            connection.onUserStatusChanged(event);
          };

      connection.onmessage = function (event: any) {
        if (event.data.showMainVideo) {
          // $('#main-video').show();
          that.showMainVideo = true;
          // $('#screen-viewer').css({
          //   top: $('#widget-container').offset().top,
          //   left: $('#widget-container').offset().left,
          //   width: $('#widget-container').width(),
          //   height: $('#widget-container').height()
          // });
          // $('#screen-viewer').show();
          return;
        }

        if (event.data.hideMainVideo) {
          // $('#main-video').hide();
          that.showMainVideo = false;
          return;
        }

        if (event.data.typing === true) {
          that.typingHint = event.extra.userFullName + ' is typing';
          return;
        }

        if (event.data.typing === false) {
          that.typingHint = '';
          return;
        }

        if (event.data.chatMessage) {
          console.log('chatMessage received');
          this.appendChatMessage(event);
          return;
        }

        if (event.data.checkmark === 'received') {
          let item = that.state.conversation.find(
            s => s.checkmark === event.data.checkmark_id
          );
          if (item) {
            item.received = true;
          }
          return;
        }

        if (event.data === 'plz-sync-points') {
          designer.sync();
          return;
        }

        designer.syncData(event.data);
      };

      connection.onstream = function (event: any) {
        if (event.stream.isScreen && !event.stream.canvasStream) {
          // $('#screen-viewer').get(0).srcObject = event.stream;
          // $('#screen-viewer').hide();
        } else if (event.extra.roomOwner === true) {
          let video: HTMLVideoElement = document.getElementById(
            'main-video'
          ) as HTMLVideoElement;
          video.setAttribute('data-streamid', event.streamid);
          // video.style.display = 'none';
          if (event.type === 'local') {
            video.muted = true;
            video.volume = 0;
          }
          video.srcObject = event.stream;
          that.showMainVideo = true;
        } else {
          event.mediaElement.controls = false;

          var otherVideos = document.querySelector('#other-videos')!;
          otherVideos.appendChild(event.mediaElement);
        }

        connection.onUserStatusChanged(event);
      };

      connection.onstreamended = function (event: any) {
        var video: HTMLVideoElement = document.querySelector(
          'video[data-streamid="' + event.streamid + '"]'
        ) as HTMLVideoElement;
        if (!video) {
          video = document.getElementById(event.streamid) as HTMLVideoElement;
          if (video) {
            video.parentNode!.removeChild(video);
            return;
          }
        }
        if (video) {
          video.srcObject = null;
          video.style.display = 'none';
        }
      };

      let tempStreamCanvas: HTMLCanvasElement | any =
        document.getElementById('temp-stream-canvas');
      // todo 添加方法声明
      var tempStream = tempStreamCanvas.captureStream();
      tempStream.isScreen = true;
      tempStream.streamid = tempStream.id;
      tempStream.type = 'local';
      window.tempStream = tempStream;
    },
    async openRoom() {
      let that = this;
      this.initConnection();
      let connection = this.connection as any;
      let isPresent = await this.checkPresence();
      if (!isPresent) {
        return;
      }
      let params = this.params;

      connection.extra.roomOwner = true;
      connection.open(
        params.sessionid,
        function (isRoomOpened: boolean, roomid: string, error: string) {
          if (error) {
            if (error === connection.errors.ROOM_NOT_AVAILABLE) {
              alert(
                'Someone already created this room. Please either join or create a separate room.'
              );
              return;
            }
            alert(error);
          }

          connection.socket.on('disconnect', function () {
            location.reload();
          });
        }
      );
    },
    joinRoom() {
      this.initConnection();
      let connection = this.connection as any;
      let params = this.params;

      connection.join(
        params.sessionid,
        function (isRoomOpened: boolean, roomid: string, error: string) {
          if (error) {
            console.log(error);
            console.log(roomid);
            if (error === connection.errors.ROOM_NOT_AVAILABLE) {
              console.log(
                'This room does not exist. Please either create it or wait for moderator to enter in the room.'
              );
              return;
            }
            if (error === connection.errors.ROOM_FULL) {
              alert('Room is full.');
              return;
            }
            if (error === connection.errors.INVALID_PASSWORD) {
              connection.password = prompt('Please enter room password.') || '';
              if (!connection.password.length) {
                alert('Invalid password.');
                return;
              }
              connection.join(
                params.sessionid,
                function (
                  isRoomOpened: boolean,
                  roomid: string,
                  error: string
                ) {
                  if (error) {
                    alert(error);
                  }
                }
              );
              return;
            }
            alert(error);
          }

          connection.socket.on('disconnect', function () {
            location.reload();
          });
        }
      );
    },
    checkPresence() {
      let that = this;
      let connection = this.roomConnection as any;
      let roomid = this.form.roomid;
      return new Promise((resolve, reject) => {
        connection.checkPresence(roomid, function (isRoomExist: boolean) {
          if (isRoomExist === true) {
            ElMessageBox.alert(
              'This room-id is already taken and room is active. Please join instead.'
            );
            resolve(false);
          }
          connection.publicRoomIdentifier = that.form.hidden ? '' : 'dashboard';
          connection.sessionid = roomid;
          connection.isInitiator = true;
          resolve(true);
        });
      });
    },
    onUserStatusChanged() {
      let that = this;
      let connection = this.connection as any;
      let names: Array<string> = [];
      connection.getAllParticipants().forEach(function (pid: string) {
        names.push(that.getFullName(pid));
      });

      if (!names.length) {
        names = ['Only You'];
      } else {
        names = [connection.extra.userFullName || 'You'].concat(names);
      }
      that.state.names = names;
    },
    getFullName(userid: string): string {
      let connection = this.connection as any;
      var _userFullName = userid;
      if (
        connection.peers[userid] &&
        connection.peers[userid].extra.userFullName
      ) {
        _userFullName = connection.peers[userid].extra.userFullName;
      }
      return _userFullName;
    },
    appendChatMessage(event: any, checkmark_id: string) {
      let connection = this.connection as any;
      let conversation = this.state.conversation;
      if (event.data) {
        conversation.push({
          user: event.extra.userFullName || event.userid,
          checkmark: '',
          data: event.data.chatMessage,
          received: false
        });

        if (event.data.checkmark_id) {
          connection.send({
            checkmark: 'received',
            checkmark_id: event.data.checkmark_id
          });
        }
      } else {
        conversation.push({
          user: 'You',
          checkmark: checkmark_id,
          data: event,
          received: false
        });
      }

      // let conversationPanel = this.$refs.conversationPanel;
      // conversationPanel.scrollTop = conversationPanel.clientHeight;
      // conversationPanel.scrollTop = conversationPanel.scrollHeight - conversationPanel.scrollTop;
    },
    handleMessage(chatMessage: string) {
      let connection = this.connection as any;

      let checkmark_id = connection.userid + connection.token();
      this.appendChatMessage(chatMessage, checkmark_id);
      connection.send({
        chatMessage: chatMessage,
        checkmark_id: checkmark_id
      });
      console.log(connection.send({
        chatMessage: chatMessage,
        checkmark_id: checkmark_id
      }));
      connection.send({
        typing: false
      });
    }
  }
});
</script>

<style></style>
