
import React, { PureComponent } from 'react'
// import base from '../base'
// import GameView from './GameView'
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/tomorrow_night_bright';

import $ from 'jquery';
import 'jquery-resizable-dom';





class EditorCodePane extends PureComponent {



    state = {
        gameTitle: 'Da Best Game',
        gameAuthor: 'Nick Satan',
        game: null,
        code: "hi",
        num: 1
    }

    constructor(props){
      super(props)
      this.reactAce = React.createRef();

      
    }

    forceUpdate = () => {
      console.log('forced update')
    }
    componentDidMount() {
    	// const { params } = this.props.match
    	// alert(params.gameId)
      
  
      const editor = this.reactAce
      console.log(editor)
      console.log(editor.value.editor.resize())


      $("#code_editor_container").resizable({ 
        handleSelector: ".splitter",
        resizeWidth: true,
        resizeHeight:false,
        resizeWidthFrom: 'right',
        onDrag: function(e, $el, newWidth, newHeight, opt){
          console.log(window)
          // this.setState({ num: "2323" })
          // console.log(this.state.num)
        }
      });  
      
    }

    onChange = (newValue) => {
      console.log('change',newValue);

      this.props.updateCurrentCode(newValue)
    }

// Render editor
  render(){
    return(
    
      <div id = "code_editor_container">
        
          <AceEditor
            key = {this.state.num}
            ref={this.reactAce}
            mode="javascript"
            theme="tomorrow_night_bright"
            width="100%"
            height="calc(100% - 89px)"
            onChange={this.onChange}
            name="code_editor"
            value={!this.props.game ? "hi" : this.props.game.code }
            editorProps={{$blockScrolling: true}}
            wrapEnabled={true}
          />

      </div>
     
    
    );
  }
} 

export default EditorCodePane;
