<!--
 * @Author: your name
 * @Date: 2021-06-13 10:33:10
 * @LastEditTime: 2021-10-06 12:25:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\git.md
-->

# git 分布式管理系统

## 初始化配置绑定邮箱和用户名-----(为了提交版本)
` git config --global user.name "kalu5" `
` git config --global user.email "451660550@qq.com" `

## 版本管理 -- 版本库(仓库)

1. 初始化
` git init `

2. 查看状态（或者仓库的变化）
` git status `

3. 添加文件
` git add . `

4. 添加到版本库（仓库）
` git commit -m 'commit' `

5. 查看具体新增的内容
` git diff `
***查看某一个文件版本库和本地中的具体内容***
` git diff HEAD -- file.txt `

6. 退出
` q `

7. 提交文件的修改 步骤3和4

8. 查看所有的版本记录
` git log `

9. 回退到上一个版本(会把当前版本删除，怎样又回到当前版本-- 步骤10)
` git reset --hard HEAD^ `

10. 回退到特定的版本
` git reflog ` --（回流）可以查看之前的历史版本------找到想要回到的版本id,通过下面命令回退  id->id
` git reset --hard id `

## 工作区 暂存区 版本库

**工作区：**建立的大文件夹
**版本库：**管理所有的版本 .git
**暂存区：**通过add把文件添加到暂存区，通过commit提交到master分支(在暂存区中还存在暂存区中的文件)

1. 查看所有文件
` git ls-files `

***git追踪的是修改的内容而不是整个文件，每次修改后都要git add 提交到最终的版本***

2. 当你添加了很多不合适的内容怎样删除(在没有提交到暂存区时)
` git checkout --file.txt `
或者(git2.23之后新增的restore)
` git restore file.txt `

3. 当你添加了很多不合适的内容怎样删除(提交到暂存区后)
先通过(git2.23之后新增的restore)` git restore --staged file.txt `回退到未提交之前，(git2.23之前）` git reset HEAD file.txt `, 然后通过
` git checkout --file.txt `删除

4. 当你添加了很多不合适的内容怎样删除(提交到版本库后)
` git reset --hard HEAD^ ` 回退到上一个版本

5. 删除文件
` rm file3.txt `

6. 删除文件夹
`rm -rf file`


## 远程仓库

1. 创建ssh
` ssh-keygen -t rsa -C "kalu5@163.com" `

2. 获取公钥值，添加到仓库，有多台电脑，添加多个
根据自己电脑的路径cat
` cat /Users/lancezhuo/.ssh/id_rsa.pub `


3. 本地仓库和远程仓库关联
` git remote add origin http://gitee.com/kalu5/puppeteer.git `

4. push到远程仓库的master分支
-u: 本地master和仓库origin master 关联
` git push -u origin master `

***以后提交只需要 ` git push origin master `不需要3和4步骤了***

5. 克隆仓库
` git clone 仓库地址 `

6. 查看是否关联远程仓库
` git remote -v `
***仓库地址尽量用SSH，HTTP传输较慢，提交的时候需要输入密码***

## 分支

HEAD指向当前的分支

1. 创建并切换到新分支dev
创建分支：` git branch dev `
切换分支：` git checkout dev `
创建并切换到新分支: ` git checkout -b dev `

**git2.23版本以后**
切换分支：` git switch dev `
创建并切换到新分支: ` git switch -c dev `

2. 切换分支
` git checkout master `

3. 查看当前分支
` git branch `

4. 合并分支
先切换到master 再合并dev
**快速合并fast forward  ，不会出现到git log**
` git checkout master `
` git merge dev `

**不使用快速合并, 使用recursive，会出现在log中**
` git checkout master `
` git merge --no-ff -m '合并dev分支' dev `


5. 删除dev分支
` git branch -d dev `
强制删除
` git branch -D dev `

***当在新分支dev上添加新的内容并提交，在再master分支上修改内容并提交，合并分支的时候会发生分支冲突***
***手动解决分支冲突：选择其中一个，并提交***

6. 查看所有分支变化的情况
` git log --graph --pretty=oneline --abbrev-commit `

***在新分支开发时，突然要修复bug ：***
1. 使用` git stash `保存当前进度，可以通过` git stash list `查看当前的进度
2. 创建新分支修改bug，并合并
3. 把当前进度拿回来：
不会删除stash存档` git stash apply `  
会删除存档` git stash pop `
一个一个删除` git stash drop `
删除所有存档` git stash clear `

**当保存了多个进度后，回到特定的进度**` git stash apply stash@{1} `
**保存进度给提示时**` git stash push -m 'message' `

***在master分支合并修复bug的分支后，在dev中也合并***
1. 找到修复bug分支的id
2. 删除修复bug的分支
3. 切换到dev分支，通过 ` git cherry-pick bug分支的id -m 1 `合并到dev分支

7. 在dev分支通过git rebase master 建立根基，回到master分支，合并dev分支git merge dev, 就可以直接提交，本地的历史更加干净，没有megerCommit（线上尽量不用，只用在本地）

## 多人协作

1. 推送master分支
` git push origin master `

2. 直接推送dev分支, 此时远程仓库会新建一个dev分支
` git push origin dev `

3. 其他人克隆项目后和dev关联
新建dev分支，并关联` git checkout -b dev origin/dev `

## tag: 不能移动，分支指针可以移动

1. 设置标签
`git tag v1.0`
2. 查看日志
`git log`
3. 查看标签
`git tag`
4. 删除标签(在本地)
`git tag -d v1.0`
5. 删除标签(在远程仓库)
`git push origin :refs/tags/v1.0`
6. 查看具体的标签
`git show v1.0`
7. 设置标签（带上说明）
`git tag -a v1.0 -m 'fabu1.0' fdd219`

## 贡献代码

1. Fork到自己的仓库
2. git clone 到本地
3. 修改代码后提交到自己的fork的分支
4. 添加Pull Requests

## 切换关联的远程仓库gitee/ github

1. 查看关联是哪个仓库
`git remote -v`

2. 删除当前的关联
`git remote rm origin`

3. 添加关联的仓库
`git remote add github git@github.com:kalu5/git_lk.git`

4. push
`git push github master`
`git push gitee master`

## 忽略文件

在.gitignore中添加不想上传的文件




