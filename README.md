# react-wait
Show placeholder when waiting, show content when done.

## Motivation

There's already a package called [react-placeholder](https://www.npmjs.com/package/react-placeholder),
why bother making a similar one? the reasons are:
* decouple the content loader, I suggest using [react-content-loader](https://www.npmjs.com/package/react-content-loader)
  as the content loader
* make content loader more customizable, using the technique [render props](https://reactjs.org/docs/render-props.html)
* make loading data the responsibility of children element

## Installation

```bash
$ npm i react-wait
```

## Usage

```javascript
import { Wait, STATUS } from 'react-wait'
```

## An example

```javascript
import react from React
import { Wait } from 'react-wait'
import { Facebook } from 'react-content-loader'

class UserInfoWithLoader extends React.Component {

  render () {
    let { userInfo } = this.state
    return <Wait renderPlaceholder={() => <Facebook />}>
      ({ start, succeed, fail } => {
        <UserInfo dataLoaded={succeed} />
      })
  	</Wait>
  }
}

class UserInfo extends React.Component {

  state = {
  	userInfo: null
  }

  async componentDidMount () {
    this.setState({ userInfo: await loadUserInfo() })
    this.props.dataLoaded(userInfo)
  }

  render () {
    let { userInfo } = this.state
    return userInfo ? null : <div>{userInfo.name}</div>
  }
}

```

check *test.js* and *example* for more details

## API

### Wait.props

* initialStatus

must be one of `STATUS.WAITING`, `STATUS.SUCCEED`, `STATUS.FAILED`, default to `STATUS.WAITING`

* loader

a function or react node (anything can be renderd),  if it is a function, it accept one argument which is provided by child when
it call the `start` callback. check example for details.

the loader is only showed when status is `STATUS.WAITING`

* errorContent

a function or react node (anything can be renderd),  if it is a function, it accept one argument which is provided by child when
it call the `fail` callback. check example for details

the loader is only showed when status is `STATUS.FAILED`

* children

a function accepts 3 parameters:

  * wait - tell component `Wait` start waiting, status is `STATUS.WAITING`
  * succeed - tell component `Wait` status is `STATUS.succeeded`
  * fail - tell component `Wait` status is `STATUS.failed`

*react-wait* assures that children is only renderd/mounted once, so
it is safe to start some asynchronous task in `componentDidMount`

***CAVEAT!***

```

you must make sure children don't show, eg. render null|false|'' when WAITING/FAILED, Wait will always show children.

A common pattern is only show some content when children does load the required data
```




###

## Development

```bash
$ git clone git@github.com:xiechao06/react-wait.git
$ cd react-wait
$ npm ci
$ npm run dev # enter watching-testing mode
```

## Build

```bash
$ cd react-wait
$ npm ci
$ npm run build
```

## Run example

```bash
$ cd react-wait
$ npm run build
$ cd example
$ npm ci
$ npm start
```
