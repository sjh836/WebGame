# 웹게임 프로그래밍

## 17-1학기 4B 이정훈
주소: http://devljh.com/game/

- 우분투서버에 개발환경 구축
- [phaser.io 튜토리얼 진행](http://phaser.io/tutorials/making-your-first-phaser-game)
- [api 문서](http://phaser.io/docs/2.6.2/index)

## phaser 프레임워크
### 1. phaser 란?
게임 프레임워크로 MIT라이센스이며, HTML5로 게임을 만들 수 있는 자바스크립트 오픈소스이다.

### 2. game loop
![게임진행](http://img1.daumcdn.net/thumb/R1920x0/?fname=http%3A%2F%2Fcfile26.uf.tistory.com%2Fimage%2F231AE24A58EA0CB618194A)

* preload : 게임은 모든 assets이 preload를 통해 미리 로드된다. 미리 로드를 하지 않으면 게임이 깨진다.
* create : preload한 후에 게임의 초기 상태를 설정한다.
* update : 설정된 간격(defalut: 초당 60회)으로 게임 상태를 업데이트 하기 위해 호출된다. 모든 업데이트가 여기서 수행된다. 예를들면 캐릭터와 적이 충돌했는지 확인하고, 유저를 생성한다던지, 이동을 한다던지 등등
* render : update 이후에 게임의 최신 상태가 화면에 그려진다.

### 3. 트러블 슈팅 가이드
#### 3-1. 메모리 누수 현상
발사체, 적군, 아이템 등을 만들 때 흔히 메모리 누수가 일어난다. 리소스를 효과적으로 통제하는 방법으로 즉석에서 객체를 생성하는 것 보단, group pool을 만들고 재활용하는 것이 좋다. 화면 밖을 벗어나면 outOfBoundsKill을 이용하여 회수하는 것이 좋다.

# 내가 만든 즐겜
## 점프점프 마리오 : [바로가기](https://ibetter.kr/~lee2012335054/4.html)
![마리오](http://img1.daumcdn.net/thumb/R1920x0/?fname=http%3A%2F%2Fcfile4.uf.tistory.com%2Fimage%2F274AB44958EA12030EE975)

## 벽돌깨기 : [바로가기](https://ibetter.kr/~lee2012335054/5.html)
![벽돌깨기](http://img1.daumcdn.net/thumb/R1920x0/?fname=http%3A%2F%2Fcfile8.uf.tistory.com%2Fimage%2F2475A74958EA1202140A68)

## 전투기(air-war) : [바로가기](https://ibetter.kr/~lee2012335054/6.html)
![전투기1](http://img1.daumcdn.net/thumb/R1920x0/?fname=http%3A%2F%2Fcfile24.uf.tistory.com%2Fimage%2F242E0D4958EA6C7A199926)
![전투기2](http://img1.daumcdn.net/thumb/R1920x0/?fname=http%3A%2F%2Fcfile2.uf.tistory.com%2Fimage%2F271BF64958EA6C7B105AAE)
![전투기3](http://img1.daumcdn.net/thumb/R1920x0/?fname=http%3A%2F%2Fcfile22.uf.tistory.com%2Fimage%2F256D504A58F7013B02317B)