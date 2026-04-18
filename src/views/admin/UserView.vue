<template>
  <div class="user" :class="isDark ? 'dark' : ''">
    <h2>用户管理</h2>
    <div style="margin: 10px 0">
      <el-button type="primary" @click="onPage(null)" plain>添加</el-button>
      <span style="position: relative; font-size: 12px; float: right; top: 20px; right: 50px"
        >tips: 点击头像可更换头像</span
      >
    </div>
    <input style="display: none;" ref="fileInput" type="file" accept="image/jpeg, image/png, image/jpg"/>
    <el-table :data="users" :class="isDark ? 'dark' : ''">
      <el-table-column label="用户名" prop="user" fixed width="180" />
      <el-table-column label="昵称" prop="name" width="200" />
      <el-table-column label="密码" prop="password" />
      <el-table-column label="邮箱" prop="email" width="200" />
      <el-table-column label="性别" prop="gender" width="120">
        <template #default="{ row }">
          {{
            row.gender == 0
              ? '隐藏'
              : row.gender == 1
                ? '男'
                : row.gender == 2
                  ? '女'
                  : '沃尔玛购物袋'
          }}
        </template>
      </el-table-column>
      <el-table-column label="生日" prop="birthday" width="120" />
      <el-table-column label="经验" prop="exp" />
      <el-table-column label="等级" prop="level" />
      <el-table-column label="头像" prop="avatar" width="80" align="center">
        <template #default="{ row }">
          <div>
            <img
              :src="getAvatarApi + row.avatar"
              style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid #999"
            />
            <div class="avatarMenu">
              <el-dropdown class="dropmenu" trigger="click">
                <span class="el-dropdown-link">
                  Dropdown
                  <br />
                  <br />
                  <br />
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="viewAvatar(row.avatar)">查看头像</el-dropdown-item>
                    <el-dropdown-item @click="avatarSelect(row.user,0)">设为默认</el-dropdown-item>
                    <el-dropdown-item @click="avatarSelect(row.user,1)">修改头像</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="角色" prop="role" width="200" align="center">
        <template #default="{ row }">
          <el-tag :type="row.role == 'admin' ? 'danger' : row.role.includes('moderator') ? 'warning' : 'primary'">{{ getRowRoleName(row.role) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" width="180" />
      <el-table-column label="更新时间" prop="updateTime" width="180" />
      <el-table-column width="390" align="center" fixed="right">
        <template #header>
          <el-input v-model="keyword" size="small" placeholder="Type to search" @input="search" title="可搜用户名、昵称和邮箱"/>
        </template>
        <template #default="{ row }">
          <el-button type="primary" plain @click="onPage(row)">编辑</el-button>
          <el-button type="warning" plain @click="showCollection(row)">收藏夹</el-button>
          <el-button type="success" plain @click="showApply(row)">申请</el-button>
          <el-button type="success" plain @click="showMessage(row)">消息</el-button>
          <el-button type="danger" plain @click="onDel(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination
        :class="isDark? 'dark':''"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-size="10"
        layout="total, prev, pager, next"
        background
        :total="total"
      />
    </div>
    <el-dialog
      :class="isDark ? 'dark' : ''"
      :title="dialogTitle"
      v-model="infoPage"
      width="600"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-alert
        v-if="model === 'edit'"
        title="当密码为******时不会更改密码"
        type="info"
        :closable="false"
        style="margin-bottom: 15px;"
      />
      <el-form ref="formInput" inline :rules="rules" :model="user">
        <el-form-item label="用户名" prop="user">
          <el-input v-model="user.user" style="width: 185px" placeholder="请输入用户名" :disabled="model === 'edit'"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="name">
          <el-input v-model="user.name" style="width: 200px" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="user.password"
            style="width: 200px"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="user.email" style="width: 200px" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="user.gender" style="width: 200px" placeholder="请选择性别">
            <el-option label="隐藏" :value="0"></el-option>
            <el-option label="男" :value="1"></el-option>
            <el-option label="女" :value="2"></el-option>
            <el-option label="沃尔玛购物袋" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-date-picker
            v-model="user.birthday"
            type="date"
            style="width: 200px"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            placeholder="请选择生日"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="经验" prop="exp">
          <el-input
            type="number"
            v-model="user.exp"
            style="width: 200px"
            placeholder="请输入经验"
          ></el-input>
        </el-form-item>
        <el-form-item label="等级" prop="level">
          <el-input
            type="number"
            v-model="user.level"
            style="width: 200px"
            placeholder="请输入等级"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="user.role" style="width: 200px" placeholder="请选择角色">
            <el-option label="管理员" value="admin"></el-option>
            <el-option label="普通用户" value="user"></el-option>
            <el-option label="直播区版主" value="live_moderator"></el-option>
            <el-option label="资源区版主" value="resource_moderator"></el-option>
            <el-option label="有话说版主" value="talk_moderator"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间" required>
          <el-date-picker
            v-model="user.createTime"
            type="datetime"
            style="width: 200px"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择创建时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="更新时间">
          <el-date-picker
            v-model="user.updateTime"
            type="datetime"
            style="width: 200px"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择更新时间"
            :disabled="model === 'edit'"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="danger" @click="clear()" plain>取 消</el-button>
        <el-button type="primary" @click="confirm()" plain>确 定</el-button>
      </template>
    </el-dialog>
    <el-dialog :class="isDark ? 'dark' : ''" title="裁剪头像" v-model="setAvatarPage" width="600" :close-on-click-modal="false" :show-close="false" @close="cancle()">
      <div class="cropperDiv">
        <VueCropper
          class="cropper"
          ref="cropper"
          :img="avatar"
          :outputSize="option.outputSize"
          :outputType="option.outputType"
          :info="option.info"
          :canScale="option.canScale"
          :autoCrop="option.autoCrop"
          :autoCropWidth="option.autoCropWidth"
          :autoCropHeight="option.autoCropHeight"
          :fixedBox="option.fixedBox"
          :fixed="option.fixed"
          :fixedNumber="option.fixedNumber"
          :canMove="option.canMove"
          :canMoveBox="option.canMoveBox"
          :original="option.original"
          :centerBox="option.centerBox"
          :infoTrue="option.infoTrue"
          :full="option.full"
          :enlarge="option.enlarge"
          :mode="option.mode"
          @realTime="realTime"
        >
        </VueCropper>
        <div class="operateClip">
          <div class="preview">
            <div class="previewChild" :style="{ scale: 100 / preview.h }">
              <div v-html="preview.html"></div>
            </div>
          </div>
          <Empty :height="20" />
          <el-button type="primary" :width="100" @click="cropper.rotateRight()" plain>顺时针旋转90°</el-button>
          <Empty :height="10" />
          <el-button type="primary" :width="100" @click="cropper.rotateLeft()" plain>逆时针旋转90°</el-button>
          <Empty :height="10" />
          <el-button type="success" :width="100" @click="onclip()" plain>确定</el-button>
        </div>
      </div>
    </el-dialog>
    
    <el-dialog
      :class="isDark ? 'dark' : ''"
      title="头像预览"
      v-model="viewAvatarDialog"
      width="600"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <div style="display: flex; justify-content: center; align-items: flex-start; gap: 40px;">
        <div style="text-align: center;">
          <p>大尺寸 (256x256)</p>
          <img :src="getAvatarApi + currentAvatar" style="width: 256px; height: 256px; border-radius: 50%; border: 2px solid #999; margin-top: 10px;" />
        </div>
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <div style="text-align: center;">
            <p>中尺寸 (128x128)</p>
            <img :src="getAvatarApi + currentAvatar" style="width: 128px; height: 128px; border-radius: 50%; border: 2px solid #999; margin-top: 10px;" />
          </div>
          <div style="text-align: center;">
            <p>小尺寸 (64x64)</p>
            <img :src="getAvatarApi + currentAvatar" style="width: 64px; height: 64px; border-radius: 50%; border: 2px solid #999; margin-top: 10px;" />
          </div>
        </div>
      </div>
      <template #footer>
        <el-button type="primary" @click="viewAvatarDialog = false" plain>关闭</el-button>
      </template>
    </el-dialog>
    
    <!-- 收藏夹对话框 -->
    <el-dialog
      :class="isDark ? 'dark' : ''"
      title="收藏夹"
      v-model="isShowCollection"
      width="1000px"
      :close-on-click-modal="false"
      >
      <template #title>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>收藏夹</span>
            <el-button type="success" @click="openAddCollectionDialog" plain>添加</el-button>
          </div>
        </template>
      <el-table :data="collections" :class="isDark ? 'dark' : ''">
        <el-table-column label="ID" prop="topicId" width="220" />
        <el-table-column label="分类" prop="label" width="120" />
        <el-table-column label="标题" prop="title" min-width="400" />
        <el-table-column label="主题创建者" prop="name" width="150" >
          <template #default="{row}">
            {{row.authorName}}({{row.authorUser}})
          </template>
        </el-table-column>
        <el-table-column label="收藏时间" prop="date" width="160" />
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="{row}">
            <el-button type="warning" @click="handleRemove(row)" plain>取消收藏</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <template #footer>
        <div class="page">
          <el-pagination
            :class="isDark? 'dark':''"
            @current-change="handleCurrentCollectionChange"
            :current-page="collectionPage"
            :page-size="10"
            layout="total, prev, pager, next"
            background
            :total="totalCollection"
          />
        </div>
      </template>
      </el-dialog>
      
      <!-- 添加收藏对话框 -->
      <el-dialog
        :class="isDark ? 'dark' : ''"
        title="添加收藏"
        v-model="addCollectionDialog"
        width="500px"
        :close-on-click-modal="false"
      >
        <el-form :model="Collection" label-width="100px">
          <el-form-item label="主题ID" required>
            <el-select style="width: 500px" placeholder="请选择主题" v-model="Collection.topicId"
                            filterable
                            remote
                            reserve-keyword
                            :remote-method="remoteMethodToTopic">
              <el-option
                v-for="item in topicSelect"
                :key="item.id"
                :label="item.id"
                :value="item.id">
                <span style="float: left">{{ item.id }}</span>
                <span
                  style="
                    float: right;
                    color: var(--el-text-color-secondary);
                    font-size: 12px;
                    margin-top: -8px;
                  "
                  >{{ item.title }}<br/><span
                  style="
                    float: right;
                    color: var(--el-text-color-secondary);
                    font-size: 12px;
                    margin-top: -18px;
                  "
                  ><span style="margin-right: 50px;">{{ item.label }}</span>{{ item.user }}</span>
                </span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收藏时间">
            <el-date-picker
              v-model="Collection.date"
              type="datetime"
              placeholder="请选择收藏时间"
              style="width: 300px"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="addCollectionDialog = false">取消</el-button>
          <el-button type="primary" @click="handleAddCollection">确定</el-button>
        </template>
      </el-dialog>
      
      <!-- 申请列表对话框 -->
      <el-dialog
        :class="isDark ? 'dark' : ''"
        :title="applyDialogTitle"
        v-model="isShowApply"
        width="80%"
        :close-on-click-modal="false"
      >
        <template #title>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>{{ applyDialogTitle }}</span>
            <el-button type="success" @click="openAddApplyDialog" plain>添加</el-button>
          </div>
        </template>
        <el-table :data="applyList" :class="isDark ? 'dark' : ''">
          <el-table-column label="ID" prop="id" width="280" />
          <el-table-column label="申请用户" width="200">
            <template #default="{ row }">
              {{ row.fromUserName }}({{ row.fromUser }})
            </template>
          </el-table-column>
          <el-table-column label="添加用户" width="200">
            <template #default="{ row }">
              {{ row.toUserName }}({{ row.toUser }})
            </template>
          </el-table-column>
          <el-table-column label="申请时间" prop="date" width="160" />
          <el-table-column label="申请理由" prop="reason" min-width="200" />
          <el-table-column label="状态" prop="status" width="100">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : row.status === 0 ? 'warning' : 'danger'">
                {{ row.status === 1 ? '已接受' : row.status === 0 ? '未处理' : '已拒绝' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" plain @click="openEditApplyDialog(row)">编辑</el-button>
              <el-button type="danger" plain @click="handleDeleteApply(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page">
          <el-pagination
            :class="isDark? 'dark':''"
            @current-change="handleCurrentApplyChange"
            :current-page="applyPage"
            :page-size="10"
            layout="total, prev, pager, next"
            background
            :total="totalApply"
          />
        </div>
        <template #footer>
          <el-button @click="isShowApply = false">关闭</el-button>
        </template>
      </el-dialog>
      
      <!-- 添加申请对话框 -->
      <el-dialog
        :class="isDark ? 'dark' : ''"
        :title="applyEditDialogTitle"
        v-model="addApplyDialog"
        width="600px"
        :close-on-click-modal="false"
      >
        <el-form :model="applyForm" label-width="100px">
          <el-form-item label="ID" v-if="isEditApply">
            <el-input v-model="applyForm.id" disabled/>
          </el-form-item>
          <el-form-item label="申请用户" required>
            <el-input v-model="applyForm.fromUser" disabled style="width: 100%" />
          </el-form-item>
          <el-form-item label="添加用户" required>
            <el-select 
              style="width: 100%" 
              v-model="applyForm.toUser" 
              placeholder="请选择添加用户"
              filterable
              remote
              reserve-keyword
              :remote-method="remoteMethodToUser"
              :disabled="isEditApply">
              <el-option v-for="item in userSelect" :key="item.user" :label="item.user" :value="item.user">
                <span style="float: left">{{ item.user }}</span>
                <span style="float: right; color: var(--el-text-color-secondary); font-size: 12px;">{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申请时间">
            <el-date-picker
              v-model="applyForm.date"
              type="datetime"
              placeholder="请选择申请时间"
              style="width: 100%"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
          <el-form-item label="申请理由">
            <el-input v-model="applyForm.reason" type="textarea" :rows="3" maxlength="100" show-word-limit placeholder="请输入申请理由" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="applyForm.status" placeholder="请选择状态">
              <el-option label="未处理" :value="0" />
              <el-option label="已接受" :value="1" />
              <el-option label="已拒绝" :value="-1" />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="addApplyDialog = false">取消</el-button>
          <el-button type="primary" @click="handleAddApply">{{ isEditApply ? '保存' : '添加' }}</el-button>
        </template>
      </el-dialog>
      
      <!-- 消息列表对话框 -->
      <el-dialog
        :class="isDark ? 'dark' : ''"
        :title="messageDialogTitle"
        v-model="isShowMessage"
        width="80%"
        :close-on-click-modal="false"
      >
        <template #title>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>{{ messageDialogTitle }}</span>
            <el-button type="success" @click="openAddMessageDialog" plain>添加</el-button>
          </div>
        </template>
        <div style="display: flex; gap: 10px; margin-bottom: 20px;">
          <el-select v-model="noticeTypeFilter" placeholder="选择类型" style="width: 200px;" @change="getMessageList">
            <el-option label="无" value="" />
            <el-option label="全部" value="all" />
            <el-option label="主题" value="topic" />
            <el-option label="直播" value="live" />
            <el-option label="消息" value="msg" />
            <el-option label="好友" value="friend" />
          </el-select>
        </div>
        <el-table :data="messageList" :class="isDark ? 'dark' : ''">
          <el-table-column label="标题" prop="title" min-width="200" />
          <el-table-column label="操作内容" min-width="600">
            <template #default="{ row }">
              <div
                v-if="row.type === 'friend' && row.action && row.action.name"
                class="noticeContent friendType"
              >
                <img :src="getAvatarApi + row.action.avatar" class="friendAvatar" />
                <div class="friendInfo">
                  <div class="friendName">{{ row.action.name }}</div>
                  <div class="friendReason">{{ row.action.reason }}</div>
                </div>
                <div class="friendActions">
                  <button
                    class="actionButton acceptButton"
                    @click="handleFriendAccept(row,true)"
                    v-show="!row.action.handled"
                  >
                    接受
                  </button>
                  <button
                    class="actionButton rejectButton"
                    @click="handleFriendAccept(row,false)"
                    v-show="!row.action.handled"
                  >
                    拒绝
                  </button>
                  <div class="isAction" v-show="row.action.handled">
                    {{ row.action.status == 1 ? '已接受' : row.action.status == -1 ? '已拒绝' : '处理中...' }}
                  </div>
                </div>
              </div>

              <div
                v-else-if="row.type === 'friend' && row.action && !row.action.name"
                class="noticeContent"
              >
                你发送给对方(<a
                  :href="`/personal/other/${row.action.user}`"
                  target="_blank"
                  title="点击跳转"
                  >{{ row.action.user }}</a
                >)的好友申请已处理，对方
                <span class="green" v-if="row.action.status == 1">同意</span>
                <span class="red" v-else>不同意</span>
                添加你为好友
              </div>

              <div v-else-if="row.type === 'topic'" class="noticeContent topicType">
                <div class="topicText">
                  你的主题帖 (<a
                    :href="`/topic/detail/${row.action.id}`"
                    target="_blank"
                    title="点击跳转"
                    >{{ row.action.title }}</a
                  >) 显示状态已更新为：
                  <span class="red" v-if="row.action.status == -1">待整改</span>
                  <span class="green" v-else>正常显示</span>
                  <br />
                  操作员：<a
                    :href="`/personal/other/${row.action.operator}`"
                    target="_blank"
                    title="点击跳转"
                    >{{ row.action.operator }}</a
                  >
                  <br />
                  原因：{{ row.action.reason }}
                </div>
                <button class="goButton" @click="goToTopic(row.action.id)">前往</button>
              </div>

              <div v-else-if="row.type === 'live'" class="noticeContent">
                你的直播申请 (<a
                  :href="row.action.url"
                  target="_blank"
                  title="点击跳转"
                  >{{ row.action.url }}</a
                >) 已审核完成，结果如下：
                <span class="green" v-if="row.action.status == 1">已通过</span>
                <span class="red" v-else>未通过</span>
                <br />
                操作员：<a
                  :href="`/personal/other/${row.action.operator}`"
                  target="_blank"
                  title="点击跳转"
                  >{{ row.action.operator }}</a
                >
                <br />
                原因：{{ row.action.reason }}
              </div>

              <div v-else-if="row.type === 'msg'" class="noticeContent">
                        <div class="medal-notice" v-if="row.action && row.action.medal">
                          <img class="medal-icon" :src="`/img${row.action.icon}`" alt="">
                          <div class="medal-info">
                            <span>
                              恭喜你获得了 <span class="medan-name">{{ row.action.medal }}</span> 勋章！
                            </span>
                            <span>
                              获得时间：{{ row.action.gainTime }}
                            </span>
                            <span v-if="row.action.expireTime">   
                              过期时间：{{ row.action.expireTime }}
                            </span>
                          </div>
                        </div>
                        <div v-else>{{ row.action }}</div>
                      </div>

              <div v-else-if="row.type === 'all'" class="noticeContent allType">
                <img
                  :src="`/img${row.action.img}`"
                  class="allImage"
                />
                <div class="allDetail">
                  <div class="allText">{{ row.action.content }}</div>
                  <div class="subText">{{ row.action.subContent }}</div>
                  <button class="goButton" @click="goToTopic(row.action.id)">前往</button>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="status" width="100">
            <template #default="{ row }">
              {{  }}
              <el-tag :type="row.status === 1 ? 'success' : 'warning'" v-if="row.type !== 'all'">
                {{ row.status === 1 ? '已读' : '未读' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="类型" prop="type" width="120">
            <template #default="{ row }">
              <el-tag :type="getTypeTagType(row.type)">{{ getTypeLabel(row.type) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime" width="160" />
          <el-table-column label="ID" prop="id" width="280" />
          <el-table-column label="操作" width="250" align="center" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" plain @click="openEditMessageDialog(row)">编辑</el-button>
              <el-button 
                type="success" 
                plain 
                @click="handleMarkAsRead(row)"
                :disabled="row.type === 'all'"
              >{{ row.status === 1 ? '未读' : '已读' }}</el-button>
              <el-button type="danger" plain @click="handleDeleteMessage(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <template #footer>
          <div class="page">
            <el-pagination
              :class="isDark? 'dark':''"
              @current-change="handleCurrentMessageChange"
              :current-page="messagePage"
              :page-size="10"
              layout="total, prev, pager, next"
              background
              :total="totalMessage"
            />
          </div>
        </template>
      </el-dialog>
      
      <!-- 编辑通知对话框 -->
      <el-dialog
        :class="isDark ? 'dark' : ''"
        :title="messageEditDialogTitle"
        v-model="addMessageDialog"
        width="600px"
        :close-on-click-modal="false"
      >
        <el-form :model="messageForm" label-width="100px">
          <el-form-item label="ID" v-if="isEditMessage">
            <el-input v-model="messageForm.id" disabled />
          </el-form-item>
          <el-form-item label="用户" v-if="!isEditMessage && messageForm.type !== 'all'">
            <div style="display: flex; align-items: center; gap: 12px; width: 100%;">
              <el-select 
                v-model="messageForm.user" 
                placeholder="请选择用户"
                filterable
                remote
                reserve-keyword
                :remote-method="remoteMethodToUser"
                :disabled="isEditMessage"
                style="flex: 1">
                <el-option v-for="item in userSelect" :key="item.user" :label="item.user" :value="item.user">
                  <span style="float: left">{{ item.user }}</span>
                  <span style="float: right; color: var(--el-text-color-secondary); font-size: 12px;">{{ item.name }}</span>
                </el-option>
              </el-select>
              <el-checkbox v-model="messageForm.sendNotice">发送消息</el-checkbox>
            </div>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="messageForm.createTime"
              type="datetime"
              placeholder="请选择创建时间"
              style="width: 100%"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              :disabled="isEditMessage"
            />
          </el-form-item>
          <el-form-item label="标题">
            <el-input v-model="messageForm.title" placeholder="请输入标题" />
          </el-form-item>
          <el-form-item label="类型" v-if="!isEditMessage">
            <el-select v-model="messageForm.type" placeholder="请选择类型">
              <el-option label="全部(all)" value="all" />
              <el-option label="主题(topic)" value="topic" />
              <el-option label="直播(live)" value="live" />
              <el-option label="消息(msg)" value="msg" />
              <el-option label="好友(friend)" value="friend" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="messageForm.status" placeholder="请选择状态">
              <el-option label="未读" :value="0" />
              <el-option label="已读" :value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="操作内容">
            <el-input v-model="messageForm.action" type="textarea" :rows="3" placeholder="请输入操作内容" />
          </el-form-item>
          <el-alert
            v-if="selectedTemplate && templateConfig[selectedTemplate]"
            :description="templateConfig[selectedTemplate].description"
            :closable="false"
            style="margin-bottom: 16px"
          />
          <el-form-item label="模板选择">
            <el-select v-model="selectedTemplate" @change="handleTemplateChange" placeholder="选择通知模板">
              <el-option label="全部(all)模板" value="all"/>
              <el-option label="主题状态变更模板" value="topic_status"/>
              <el-option label="直播申请审核模板" value="live_apply"/>
              <el-option label="好友申请模板" value="friend_apply"/>
              <el-option label="好友申请同意模板" value="friend_apply_accept"/>
              <el-option label="好友申请拒绝模板" value="friend_apply_reject"/>
              <el-option label="勋章获取通知模板" value="medal_award"/>
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="addMessageDialog = false">取消</el-button>
          <el-button type="primary" @click="handleAddMessage">{{ isEditMessage ? '保存' : '添加' }}</el-button>
        </template>
      </el-dialog>
    </div>
  </template>
<script setup>
import 'vue-cropper/dist/index.css'
import { VueCropper }  from "vue-cropper";
import Empty from '@/components/FitEmpty.vue'
import { useRouter } from 'vue-router'
import { deleteUser, findAllUser, insertUser, updateAvatar, updateUser,getAvatarApi, findAllUsersForSelect } from '@/api/admin/user'
import { getUserCollection,findAllTopicForSelect, addUserCollection, deleteUserCollection } from '@/api/admin/topic'
import { findAllFriendApplication, insertFriendApplication, updateFriendApplication, deleteFriendApplication, findAllUserNotice as findAllUserNoticeAdmin, updateUserNotice, deleteUserNotice, updateUserNoticeRead, insertUserNotice } from '@/api/admin/interaction'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import { inject, onMounted, reactive, ref, watch } from 'vue'
const isDark = inject('isDark')
const users = ref([])

const page = ref(1)
const total = ref(0)
const handleCurrentChange = (e) => {
  page.value = e
  getUserList()
}
const search = ()=>{
  getUserList()
}

const user = ref({
  user: '',
  password: '',
  email: '',
  name: '',
  gender: 0,
  birthday: '',
  exp: 0,
  level: 0,
  role: ''
})
const oldUser = ref('')
const oldEmail = ref('')
const formInput = ref()
const model = ref('')
const rules = reactive({
  user: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (model.value === 'add' && (value.length < 6 || value.length > 20)) {
          callback(new Error('长度在 6 到 20 个字符'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
  ],
  name: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  gender: [{ required: true, message: '请选择性别', trigger: 'blur' }],
  birthday: [{ required: true, message: '请选择生日', trigger: 'blur' }],
  exp: [{ required: true, message: '请输入经验值', trigger: 'blur' }],
  level: [{ required: true, message: '请输入等级', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'blur' }]
})

const dialogTitle = ref('')
const infoPage = ref(false)
const onPage = (e) => {
  if (e === null) {
    const now = new Date().toISOString().replace('T', ' ').split('.')[0]
    user.value = {
      user: '',
      password: '',
      email: '',
      name: '',
      gender: 0,
      birthday: '',
      exp: 0,
      level: 0,
      role: 'user',
      createTime: now,
      updateTime: ''
    }
    model.value = 'add'
    dialogTitle.value = '添加用户'
  } else {
    user.value = {
      user: e.user,
      password: '******',
      email: e.email,
      name: e.name,
      gender: e.gender,
      birthday: e.birthday,
      exp: e.exp,
      level: e.level,
      role: e.role,
      createTime: e.createTime,
      updateTime: e.updateTime
    }
    oldUser.value = e.user
    oldEmail.value = e.email
    model.value = 'edit'
    dialogTitle.value = '编辑用户'
  }
  infoPage.value = true
}

const onDel = (i) => {
  ElMessageBox.confirm(i.name + '(' + i.user + ')', '确定删除该用户吗?', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await deleteUser(i.user)
        .then((res) => {
          let msg = res.data.msg
          if (msg == 'SUCCESS') {
            ElMessage.success('删除成功')
            getUserList()
          } else if (msg == 'USER_NOT_EXIST') {
            ElMessage.error('该用户不存在，你在搞事情吗？')
          } else {
            ElMessage.error('删除失败')
          }
        })
        .catch((err) => {
          ElMessage.error('删除失败')
        })
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}
const clear = () => {
  infoPage.value = false
  oldUser.value = ''
  user.value = {
    user: '',
    password: '',
    email: '',
    name: '',
    gender: 0,
    birthday: '',
    exp: 0,
    level: 0,
    role: ''
  }
}

const confirm = () => {
  formInput.value.validate((valid) => {
    if (valid) {
      if (model.value == 'add') {
        addUser()
      } else {
        editUser()
      }
    }
  })
}
const addUser = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: '处理中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  await insertUser(user.value)
    .then((res) => {
      let msg = res.data.msg
      if (msg == 'SUCCESS') {
        ElMessage.success('添加成功')
        getUserList()
        clear()
      } else if (msg == 'USER_EXIST') {
        ElMessage.error('该用户名已存在')
      } else if (msg == 'EMAIL_EXIST') {
        ElMessage.error('该邮箱已存在')
      } else {
        ElMessage.error('添加失败')
      }
    })
    .catch((err) => {
      ElMessage.error('添加失败')
    })
    .finally(() => {
      loading.close()
    })
}
const editUser = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: '处理中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  let obj = {
    user: {
      user: user.value.user,
      password: user.value.password,
      email: user.value.email,
      name: user.value.name,
      gender: user.value.gender,
      birthday: user.value.birthday,
      exp: user.value.exp,
      level: user.value.level,
      role: user.value.role,
      createTime: user.value.createTime,
      updateTime: user.value.updateTime
    },
    oldUser: oldUser.value,
    oldEmail: oldEmail.value
  }
  await updateUser(obj)
    .then((res) => {
      let msg = res.data.msg
      if (msg == 'SUCCESS') {
        ElMessage.success('修改成功')
        getUserList()
        clear()
      } else if (msg == 'USER_NOT_EXIST') {
        ElMessage.error('该用户不存在，你在搞事情吗？')
      } else if (msg == 'USER_EXIST') {
        ElMessage.error('该用户名已存在')
      } else if (msg == 'EMAIL_EXIST') {
        ElMessage.error('该邮箱已存在')
      } else {
        ElMessage.error('修改失败')
      }
    })
    .catch((err) => {
      ElMessage.error('修改失败')
    })
    .finally(() => {
      loading.close()
    })
}




const avatarSelectingUSer = ref('')
const selectDefault = async(user)=>{
  await updateAvatar(user,"default.png").then(res=>{
    if(res.data.msg == 'SUCCESS'){
      getUserList()
      ElMessage.success('设置默认头像成功')
    }
    else{
      ElMessage.error('设置默认头像失败')
    }
  }).catch(err=>{
    ElMessage.error('设置默认头像失败')
  })
}
const avatarSelect = (user,e) => {
  avatarSelectingUSer.value = user
  if(e == 0){
    selectDefault(user)
  }
  else{
    fileInput.value.click()
  }
}
const cropper = ref()
const avatar = ref('')
const fileInput = ref()
const setAvatarPage = ref(false)
const confirmAvatar = async () => {
  if (avatar.value == '') {
    ElMessage.error('请先选择图片')
  } else {
    const loading = ElLoading.service({
      lock: true,
      text: '处理中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    await updateAvatar(avatarSelectingUSer.value,avatar.value).then(res=>{
      if(res.data.msg == 'SUCCESS'){
        getUserList()
        ElMessage.success('修改头像成功')
      }
      else{
        ElMessage.error('修改头像失败')
      }
    }).catch(err=>{
      ElMessage.error('修改头像失败')
    }).finally(() => {
      loading.close()
    })
  }
  fileInput.value.value = ''
  avatar.value = ''
}
const option = reactive({
  outputSize: 1, // 裁剪生成图片的质量
  outputType: 'png', // 裁剪生成图片的格式
  info: true, // 裁剪框的大小信息
  canScale: false, // 图片是否允许滚轮缩放
  autoCrop: true, // 是否默认生成截图框
  autoCropWidth: 100, // 默认生成截图框宽度
  autoCropHeight: 100, // 默认生成截图框高度
  fixedBox: false, // 固定截图框大小 不允许改变
  fixed: true, // 是否开启截图框宽高固定比例，这个如果设置为true，截图框会是固定比例缩放的，如果设置为false，则截图框的狂宽高比例就不固定了
  fixedNumber: [1, 1], // 截图框的宽高比例 [ 宽度 , 高度 ]
  canMove: true, // 上传图片是否可以移动
  canMoveBox: true, // 截图框能否拖动
  original: false, // 上传图片按照原始比例渲染
  centerBox: true, // 截图框是否被限制在图片里面
  infoTrue: false, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
  full: true, // 是否输出原图比例的截图
  enlarge: '1', // 图片根据截图框输出比例倍数
  mode: 'contain' // 图片默认渲染方式 contain , cover, 100px, 100% auto
})
const preview = ref('')
const realTime = (data) => {
  preview.value = data
}
const onclip = () => {
  cropper.value.getCropData((data) => {
    avatar.value = data
    setAvatarPage.value = false
    confirmAvatar()
  })
}
const cancle = ()=>{
  setAvatarPage.value = false
  avatarSelectingUSer.value = ''
}



const keyword = ref('')
const getUserList = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  await findAllUser(page.value,keyword.value)
    .then((res) => {
      users.value = res.data.object
      total.value = res.data.num
    })
    .catch((err) => {
      ElMessage.error('获取用户列表失败')
    })
    .finally(() => {
      loading.close()
    })
}
const initInput = ()=>{
  fileInput.value.addEventListener('change', function () {
    let fileInputValue = fileInput.value
    // 清除背景图片:
    if (!fileInputValue.value) {
      fileInputValue.value = ''
      return
    }
    let file = fileInputValue.files[0]
    let size = file.size
    if (size >= 5 * 1024 * 1024) {
      fileInputValue.value = ''
      ElMessage.error('文件大小超出限制(5MB)')
      return false
    }
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      fileInputValue.value = ''
      ElMessage.error('不是有效的图片文件!')
      return
    }
    // 读取文件:
    let reader = new FileReader()
    reader.onload = function (e) {
      let data = e.target.result
      avatar.value = data
      setAvatarPage.value = true
    }
    // 以DataURL的形式读取文件:
    reader.readAsDataURL(file)
  })
}

const getRowRoleName = (role)=>{
  return role == 'admin' ? '管理员' 
  : role == 'resource_moderator' ? '资源区版主' 
  : role == 'talk_moderator' ? '有话说版主' 
  : role == 'live_moderator' ? '直播区版主' 
  : '普通用户'
}

// 头像查看相关变量
const viewAvatarDialog = ref(false)
const currentAvatar = ref('')

// 查看头像方法
const viewAvatar = (avatar) => {
  currentAvatar.value = avatar
  viewAvatarDialog.value = true
}

const isShowCollection = ref(false)
const collections = ref([])
const totalCollection = ref(0)
const CollectionUser = ref('')

// 添加收藏对话框相关变量
const addCollectionDialog = ref(false)
const Collection = ref({})
// 打开添加收藏对话框
const openAddCollectionDialog = () => {
  Collection.value = {
    topicId: '',
    date: new Date()
  }
  addCollectionDialog.value = true
}

// 处理添加收藏
const handleAddCollection = async() => {
  // 这里可以添加表单验证
  if (!Collection.value.topicId) {
    ElMessage.warning('请输入主题ID')
    return
  }
  const loading = ElLoading.service({
    lock: true,
    text: '处理中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  Collection.value.user = CollectionUser.value
  await addUserCollection(Collection.value)
  .then(res=>{
    if(res.data.msg == 'SUCCESS'){
      ElMessage.success('添加收藏成功')
      getCollection()
    }
    else if(res.data.msg == 'EXIST_ERROR'){
      ElMessage.warning('已收藏过该主题')
    }
    else{
      ElMessage.error('添加收藏失败')
    }
  })
  .catch(err=>{
    ElMessage.error('添加收藏失败')
  })
  .finally(() => {
    loading.close()
  })
  
  addCollectionDialog.value = false
}

const showCollection = (user)=>{
  CollectionUser.value = user.user
  isShowCollection.value = true
  getCollection()
}
const collectionPage = ref(1)
const handleCurrentCollectionChange = (e)=>{
  collectionPage.value = e
  getCollection()
}
const getCollection = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  await getUserCollection(CollectionUser.value,collectionPage.value)
  .then(res=>{
    console.log(res)
    totalCollection.value = res.data.num
    collections.value = res.data.object
  })
  .catch(err=>{
    ElMessage.error('获取用户收藏失败')
  })
  .finally(() => {
    loading.close()
  })
}
const topicSelect = ref([])
const remoteMethodToTopic = async (queryString) => {
  if (!queryString) {
    topicSelect.value = [];
    return;
  }
  const loading = ElLoading.service({
    lock: true,
    text: '搜索中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  await findAllTopicForSelect(queryString).then(res=>{
    if (res.data.msg === 'SUCCESS') {
      topicSelect.value = res.data.object || [];
    } else {
      ElMessage.error('获取主题列表失败！');
    }
  })
  .catch(err=>{
    console.log(err);
    ElMessage.error('服务异常');
  })
  .finally(() => {
    loading.close()
  })
}

const handleRemove = async(collection)=>{
  ElMessageBox.confirm('确定删除收藏吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async()=>{
    const loading = ElLoading.service({
      lock: true,
      text: '处理中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    await deleteUserCollection(collection.topicId,collection.user)
    .then(res=>{
      if(res.data.msg == 'SUCCESS'){
        ElMessage.success('删除收藏成功')
        getCollection()
      }
      else if(res.data.msg == 'NOT_EXIST_ERROR'){
        ElMessage.warning('收藏不存在')
      }
      else{
        ElMessage.error('删除收藏失败')
      }
    })
    .catch(err=>{
      ElMessage.error('删除收藏失败')
    })
    .finally(() => {
      loading.close()
    })
  })
}

// 申请列表相关变量和方法
const isShowApply = ref(false)
const applyList = ref([])
const totalApply = ref(0)
const applyPage = ref(1)
const applyDialogTitle = ref('')
const applyEditDialogTitle = ref('')
const applyUser = ref('')

const showApply = (user) => {
  applyUser.value = user.user
  applyDialogTitle.value = user.name + '的申请列表'
  applyPage.value = 1
  isShowApply.value = true
  getApplyList()
}

const handleCurrentApplyChange = (e) => {
  applyPage.value = e
  getApplyList()
}

const getApplyList = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  await findAllFriendApplication(applyUser.value,applyPage.value)
    .then(res => {
      if (res.data.msg === 'SUCCESS') {
        console.log(res.data.object)
        applyList.value = res.data.object || []
        totalApply.value = res.data.num
      } else {
        ElMessage.error('获取申请列表失败')
      }
    })
    .catch(err => {
      ElMessage.error('获取申请列表失败')
    })
    .finally(() => {
      loading.close()
    })
}

// 添加申请对话框相关变量和方法
const addApplyDialog = ref(false)
const isEditApply = ref(false)
const applyForm = ref({
  id: '',
  fromUser: '',
  toUser: '',
  date: '',
  reason: '',
  status: 0
})

const userSelect = ref([])

const remoteMethodToUser = async (queryString) => {
  if (!queryString) {
    userSelect.value = []
    return
  }
  const loading = ElLoading.service({
    lock: true,
    text: '搜索中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  await findAllUsersForSelect(queryString).then(res => {
    if (res.data.msg === 'SUCCESS') {
      userSelect.value = res.data.object
    } else {
      ElMessage.error('获取用户列表失败！')
    }
  }).catch(err => {
    console.log(err)
    ElMessage.error('服务异常')
  }).finally(() => {
    loading.close()
  })
}

const openAddApplyDialog = () => {
  isEditApply.value = false
  applyEditDialogTitle.value = '添加申请'
  applyForm.value = {
    id: '',
    fromUser: applyUser.value,
    toUser: '',
    date: '',
    reason: '',
    status: 0
  }
  addApplyDialog.value = true
}

const openEditApplyDialog = (row) => {
  isEditApply.value = true
  applyEditDialogTitle.value = '编辑申请'
  applyForm.value = {
    id: row.id,
    fromUser: row.fromUser,
    toUser: row.toUser,
    date: row.date,
    reason: row.reason,
    status: row.status
  }
  addApplyDialog.value = true
}

const handleAddApply = async () => {
  if (!applyForm.value.fromUser || !applyForm.value.toUser) {
    ElMessage.warning('请填写必填项')
    return
  }
  
  const loading = ElLoading.service({
    lock: true,
    text: '处理中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  
  if (isEditApply.value) {
    await updateFriendApplication(applyForm.value)
      .then(res => {
        let msg = res.data.msg
        if (msg === 'SUCCESS') {
          ElMessage.success('编辑成功')
          addApplyDialog.value = false
          getApplyList()
        }
        else if(msg == 'EXIST_APPLICATION'){
          ElMessage.error('已经存在未处理的好友申请')
        }
        else if(msg == 'TO_USER_EXIST_APPLICATION'){
          ElMessage.error('对方用户已经存在未处理的好友申请')
        }
        else {
          ElMessage.error('编辑失败')
        }
      })
      .catch(err => {
        ElMessage.error('编辑失败')
      })
      .finally(() => {
        loading.close()
      })
  } else {
    await insertFriendApplication(applyForm.value)
      .then(res => {
        let msg = res.data.msg
        if (msg === 'SUCCESS') {
          ElMessage.success('添加成功')
          addApplyDialog.value = false
          getApplyList()
        }
        else if(msg == 'TO_USER_EXIST_APPLICATION'){
          ElMessage.error('对方用户已经存在未处理的好友申请')
        }
        else {
          ElMessage.error('添加失败')
        }
      })
      .catch(err => {
        ElMessage.error('添加失败')
      })
      .finally(() => {
        loading.close()
      })
  }
}

const handleDeleteApply = async (row) => {
  ElMessageBox.confirm('确定删除该申请吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const loading = ElLoading.service({
      lock: true,
      text: '处理中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    await deleteFriendApplication(row.id)
      .then(res => {
        if (res.data.msg === 'SUCCESS') {
          ElMessage.success('删除成功')
          getApplyList()
        } else {
          ElMessage.error('删除失败')
        }
      })
      .catch(err => {
        ElMessage.error('删除失败')
      })
      .finally(() => {
        loading.close()
      })
  }).catch(() => {
    // 取消删除，不做任何操作
  })
}

// 消息列表相关变量和方法
const isShowMessage = ref(false)
const messageList = ref([])
const totalMessage = ref(0)
const messagePage = ref(1)
const messageDialogTitle = ref('')
const messageEditDialogTitle = ref('')
const messageUser = ref('')
const noticeTypeFilter = ref('')

const showMessage = (user) => {
  messageUser.value = user.user
  messageDialogTitle.value = user.name + '的消息列表'
  messagePage.value = 1
  noticeTypeFilter.value = ''
  isShowMessage.value = true
  getMessageList()
}

const handleCurrentMessageChange = (e) => {
  messagePage.value = e
  getMessageList()
}

const getMessageList = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  await findAllUserNoticeAdmin(messageUser.value,messagePage.value, noticeTypeFilter.value)
    .then(res => {
      if (res.data.msg === 'SUCCESS') {
        messageList.value = res.data.object || []
        messageList.value.forEach(item => {
          if (item.action) {
            item.action = JSON.parse(item.action)
          }
        })
        totalMessage.value = res.data.num
      } else {
        ElMessage.error('获取通知列表失败')
      }
    })
    .catch(err => {
      ElMessage.error('获取通知列表失败')
    })
    .finally(() => {
      loading.close()
    })
}

const getTypeLabel = (type) => {
  const typeMap = {
    'all': '全部',
    'topic': '主题',
    'live': '直播',
    'msg': '消息',
    'friend': '好友'
  }
  return typeMap[type] || type
}

const getTypeTagType = (type) => {
  const typeMap = {
    'all': 'primary',
    'topic': 'success',
    'live': 'warning',
    'msg': 'info',
    'friend': 'danger'
  }
  return typeMap[type] || ''
}

const handleMarkAsRead = async (row) => {
  const loading = ElLoading.service({
    lock: true,
    text: '处理中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  const isRead = row.status === 1 ? false : true
  await updateUserNoticeRead(row.id, isRead)
    .then(res => {
      if (res.data.msg === 'SUCCESS') {
        ElMessage.success(isRead ? '标记已读成功' : '标记未读成功')
        row.status = isRead ? 1 : 0
        getMessageList()
      } else {
        ElMessage.error('操作失败')
      }
    })
    .catch(err => {
      ElMessage.error('操作失败')
    })
    .finally(() => {
      loading.close()
    })
}

const handleDeleteMessage = async (row) => {
  ElMessageBox.confirm('确定删除该通知吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const loading = ElLoading.service({
      lock: true,
      text: '处理中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    await deleteUserNotice(row.id)
      .then(res => {
        if (res.data.msg === 'SUCCESS') {
          ElMessage.success('删除成功')
          getMessageList()
        } else {
          ElMessage.error('删除失败')
        }
      })
      .catch(err => {
        ElMessage.error('删除失败')
      })
      .finally(() => {
        loading.close()
      })
  }).catch(() => {
    // 取消删除，不做任何操作
  })
}

const router = useRouter()

const goToTopic = (id) => {
  router.push({ name: 'topicDetail', params: { id: id } })
}

const handleFriendAccept = async(notice,accept) => {
  ElMessage.warning('无法操作好友申请') 
}

// 编辑通知对话框相关变量和方法
const addMessageDialog = ref(false)
const isEditMessage = ref(false)
const selectedTemplate = ref('')
const messageForm = ref({
  id: '',
  user: '',
  createTime: '',
  title: '',
  type: '',
  status: 0,
  action: '',
  sendNotice: true
})

// 模板配置
const templateConfig = {
  all: {
    title: '活动标题',
    type: 'all',
    action: '{"content": "这是一条通用通知"}',
    description: '通用通知模板，适用于所有类型的通知。\ncontent: 通知内容'
  },
  topic_status: {
    title: '帖子状态有更新',
    type: 'topic',
    action: '{"id": "帖子ID", "title": "帖子标题", "status": 0, "operator": "操作用户", "reason": "原因"}',
    description: '主题状态变更通知模板。id: 主题ID、title: 主题标题、status: 状态码(0-草稿, 1-正常, -1-待整改)、operator: 操作用户、reason: 变更原因'
  },
  live_apply: {
    title: '直播申请(已/不)通过',
    type: 'live',
    action: '{"id": "直播申请ID", "url": "直播申请链接", "reason": "原因", "operator": "操作用户", "status": false}',
    description: '直播申请审核通知模板。id: 直播ID、url: 直播地址、reason: 审核原因、operator: 审核人、status: 是否通过(true-通过, false-拒绝)'
  },
  friend_apply: {
    title: '新的好友申请',
    type: 'friend',
    action: '{"id": "好友申请ID", "name": "用户名称", "user": "用户ID", "avatar": "用户头像", "reason": "原因", "status": 0, "handled": false}',
    description: '好友申请通知模板。id: 申请ID、name: 申请人昵称、user: 申请人用户ID、avatar: 申请人头像、reason: 申请原因、status: 状态码(0-待处理, 1-已同意, -1-已拒绝)、handled: 是否已处理'
  },
  friend_apply_accept: {
    title: '新好友',
    type: 'friend',
    action: '{"user": "用户ID", "status": 1}',
    description: '好友申请同意通知模板。user: 同意申请的用户ID、status: 状态码(1-已同意)'
  },
  friend_apply_reject: {
    title: '拒绝添加好友',
    type: 'friend',
    action: '{"user": "用户ID", "status": -1}',
    description: '好友申请拒绝通知模板。user: 拒绝申请的用户ID、status: 状态码(-1-已拒绝)'
  },
  medal_award: {
    title: '恭喜获得(勋章名称)',
    type: 'msg',
    action: '{"id": "勋章ID", "medal": "勋章名称", "icon": "勋章图标", "description": "勋章描述", "gainTime": "获取时间", "expireTime": "过期时间"}',
    description: '勋章获取通知模板。id: 勋章ID、medal: 勋章名称、icon: 勋章图标、description: 勋章描述、gainTime: 获取时间(格式: yyyy-MM-dd HH:mm:ss)、expireTime: 过期时间(格式: yyyy-MM-dd HH:mm:ss)'
  }
}

// 模板选择变化时自动填充内容
const handleTemplateChange = ()=>{
  if(selectedTemplate.value && templateConfig[selectedTemplate.value]){
    const template = templateConfig[selectedTemplate.value]
    messageForm.value.title = template.title
    messageForm.value.type = template.type
    messageForm.value.action = template.action
  }
}

const openAddMessageDialog = () => {
  isEditMessage.value = false
  messageEditDialogTitle.value = '添加通知'
  messageForm.value = {
    id: '',
    user: messageUser.value,
    createTime: new Date().toISOString().replace('T', ' ').split('.')[0],
    title: '',
    type: '',
    status: 0,
    action: '',
    sendNotice: true
  }
  selectedTemplate.value = ''
  addMessageDialog.value = true
}

const openEditMessageDialog = (row) => {
  isEditMessage.value = true
  messageEditDialogTitle.value = '编辑通知'
  messageForm.value = {
    id: row.id,
    user: row.user,
    createTime: row.createTime,
    title: row.title,
    type: row.type,
    status: row.status,
    action: JSON.stringify(row.action)
  }
  selectedTemplate.value = ''
  addMessageDialog.value = true
}

const handleAddMessage = async () => {
  if ((!messageForm.value.user || messageForm.value.type === 'all') && !messageForm.value.title && !messageForm.value.action) {
    ElMessage.warning('请填写必填项')
    return
  }
  try{
    JSON.parse(messageForm.value.action)
  }
  catch(e){
    ElMessage.warning('操作内容必须是规范的Json字符串')
    return
  }
  
  const loading = ElLoading.service({
    lock: true,
    text: '处理中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  
  if (isEditMessage.value) {
    await updateUserNotice({
      id: messageForm.value.id,
      user: messageForm.value.user,
      createTime: messageForm.value.createTime,
      title: messageForm.value.title,
      type: messageForm.value.type,
      status: messageForm.value.status,
      action: messageForm.value.action,
      sendNotice: messageForm.value.sendNotice
    })
      .then(res => {
        if (res.data.msg === 'SUCCESS') {
          ElMessage.success('更新成功')
          addMessageDialog.value = false
          getMessageList()
        } else {
          ElMessage.error('更新失败')
        }
      })
      .catch(err => {
        ElMessage.error('更新失败')
      })
      .finally(() => {
        loading.close()
      })
  } else {
    await insertUserNotice({
      user: messageForm.value.user,
      createTime: messageForm.value.createTime,
      title: messageForm.value.title,
      type: messageForm.value.type,
      status: messageForm.value.status,
      action: messageForm.value.action,
      sendNotice: messageForm.value.sendNotice
    })
      .then(res => {
        if (res.data.msg === 'SUCCESS') {
          ElMessage.success('添加成功')
          addMessageDialog.value = false
          getMessageList()
        } else {
          ElMessage.error('添加失败')
        }
      })
      .catch(err => {
        ElMessage.error('添加失败')
      })
      .finally(() => {
        loading.close()
      })
  }
}

watch(() => messageForm.value.type, (newType) => {
  if (newType === 'all' && !isEditMessage.value) {
    messageForm.value.user = ''
  }
})

const init = () => {
  getUserList()
  initInput()
}
onMounted(init)
</script>
<style scoped>
.user {
  width: calc(100% - 40px);
  margin: 20px;
}
.avatarMenu {
  position: absolute;
  width: 45px;
  height: 45px;
  margin-top: -50px;
  margin-left: 5px;
  background-color: #222;
  border-radius: 50%;
  cursor: pointer;
  background-color: #111;
  overflow: hidden;
  opacity: 0;
}
.avatarMenu .dropmenu {
  left: -12px;
}
.page {
  margin-top: 20px;
  display: flex;
  justify-content: end;
}
.cropperDiv{
  height: 300px;
  display: flex;
}
.cropper{
  width: 300px;
  height: 300px;
}
.operateClip{
  display: flex;
  flex-direction: column;
  justify-content: start;
  margin-left: 80px;
}
.preview{
  width: 100px;
  height: 100px;
  transition: all 0.2s;
  overflow: hidden;
}
.preview:hover{
  border-radius: 50%;
}
.previewChild{
  width: 100px;
  transform-origin: 0 0;
}

.noticeContent {
  font-size: 14px;
  margin-bottom: 8px;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
}
.friendType {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  -webkit-line-clamp: unset;
}
.friendAvatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}
.friendInfo {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.friendName {
  font-size: 15px;
  font-weight: bold;
}
.friendReason {
  font-size: 14px;
  line-height: 1.5;
}
.friendActions {
  display: flex;
  gap: 8px;
  align-items: center;
}
.actionButton {
  padding: 6px 16px;
  border: none;
  border-radius: 4px;
  color: #131313;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  flex-shrink: 0;
}
.actionButton:hover {
  background-image: url('@/assets/img/set/oak.png');
}
.acceptButton {
  background-image: url('@/assets/img/set/birch.png');
}
.rejectButton {
  background-image: url('@/assets/img/set/spruce.png');
  color: #f1f1f1;
}
.topicType {
  display: flex;
  flex-direction: row;
  gap: 10px;
  -webkit-line-clamp: unset;
}
.topicText {
  font-size: 14px;
  line-height: 1.5;
  flex: 1;
}
.medal-notice{
  display: flex;
  align-items: flex-start;
}
.medal-icon {
  width: 80px;
  height: 80px;
  margin-right: 5px;
  flex-shrink: 0;
  image-rendering: auto;
  border-radius: 4px;
  border: 2px solid #835a26;
}
.medal-info{
  padding: 5px 2px;
  display: flex;
  flex-direction: column;
}
.medan-name{
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
  padding: 0px 4px;
}
.goButton {
  align-self: flex-end;
  padding: 6px 14px;
  background-image: url('@/assets/img/set/oak.png');
  color: #1d1d1d;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}
.goButton:hover {
  background-color: #5c5542;
}
.allType {
  display: flex;
  gap: 10px;
  -webkit-line-clamp: unset;
}
.allImage {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  object-fit: cover;
  flex-shrink: 0;
}
.allDetail {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 60px;
}
.allText {
  font-size: 14px;
  line-height: 1.5;
  flex: 1;
  margin-bottom: 8px;
}
.subText{
  font-size: 12px;
  font-style: italic;
}
.green {
  color: #0ea509;
}
.red {
  color: #970f11;
}
</style>
