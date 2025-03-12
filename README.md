# 쁘디 프로젝트트

회사 직원들과 얘기 중에 흠칫해서 만들어본 쁘띠프로젝트

```bash
npm install

npm run dev
```

프로젝트: [http://localhost:3000](http://localhost:3000)

## 개발환경

IDE: Cursor

AI: claude-sonnet 3.5, V0

Front: Next.js, React, Typescript, Tailwind

### 웹 화면에서 데이터베이스 모델링 / 노션같은 페이지 제작

말 그대로 데이터베이스 모델링을 만들어 봤습니다.

노션같은 페이지를 제작했습니다.

input이 아닌 ref와 contentEditable을 활용해서 작성했습니다.

input을 사용해서 value를 보내는 것이 아닌 영역의 이벤트를 활용하고자 2가지 방법을 사용했습니다.

키보드이벤트를 활용하여 "Enter"로 입력될 때 다른 Text란이 새롭게 나오고 "Shift + Enter"을 입력해야 아랫 줄이 생성되는 기능을 구현했습니다.

즉, ref와 contentEditable을 활용하면 기존 input, textarea보다 다양하고 복잡한 텍스터 에디터 구현이 가능하고, 커스텀 스타일링과 제어가 쉬워집니다.

이 프로젝트의 최대 단점은 그냥 실행시간이 느리고 컴포넌트화가 미약하게 되었습니다.

### 해당 프로젝트를 통해 발품이 가능할까?

음... 제작하면서 우선 "양식에 대해서 활용해보자"라는 마음에서 시작되었습니다.

공기관이나 회사에서 사용하는 문서 양식을 만들어서 웹 사이트에서 쉽게 접근해서 바로 출력할 수 있게 만들면 좋겠다라는 생각으로 시작했고

추가로, 회의록 작성을 위해서 이런식으로 만들면 좋겠다라는 생각도 있었습니다.

데이터 베이스 모델링 같은 경우 웹 사이트에서 쉽게 모델링을 하고 바로 DB에 table과 field가 바로 생성이 되면 좋을 것 같아서 UI적으로 디자인을 해봤습니다.
