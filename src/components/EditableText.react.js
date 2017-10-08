// @flow

import "./css/EditableText.css";

const React = require("react");
const pencil = require("./svg/pencil.svg");

type Props = {
  text: string,
  onTextChange: (newText: string) => void
};

type State = {
  textBeforeEdit: string /* When editing multiple times, `textBeforeEdit` changes on every successful update. */,
  isEditing: boolean,
  editedText: string /* This is the input value while editing. */
};

class EditableText extends React.Component<Props, State> {
  input: HTMLInputElement;

  state = {
    textBeforeEdit: this.props.text,
    isEditing: false,
    editedText: this.props.text
  };

  inputRef = (input: ?HTMLInputElement): void => {
    if (input != null) {
      this.input = input;
      this.focusInput();
    }
  };

  focusInput(): void {
    if (this.input != null) {
      this.input.focus();
      // Move the cursor to the end
      this.input.selectionStart = this.input.selectionEnd = this.input.value.length;
    }
  }

  renderForm(): React.Node {
    const { editedText } = this.state;

    return (
      <form className="EditableText-form" onSubmit={this.onFormSubmit}>
        <input
          className="EditableText-input"
          type="text"
          value={editedText}
          onChange={this.onEditedTextChange}
          onBlur={this.onEditCancel}
          onKeyDown={this.onKeyDown}
          ref={this.inputRef}
        />
      </form>
    );
  }

  onEditedTextChange = (event: SyntheticEvent<>): void => {
    if (event.target instanceof HTMLInputElement) {
      this.setState({
        editedText: event.target.value
      });
    }
  };

  onEditCancel = () => {
    this.setState({
      isEditing: false
    });
  };

  onKeyDown = (event: SyntheticEvent<>): void => {
    // Escape
    if (event.keyCode === 27) {
      this.onEditCancel();
    }
  };

  onFormSubmit = (event: SyntheticEvent<>): void => {
    const { onTextChange } = this.props;
    const { textBeforeEdit, editedText } = this.state;

    event.preventDefault();

    if (editedText === textBeforeEdit) {
      this.onEditCancel();
      return;
    }

    onTextChange(editedText);

    this.setState({
      textBeforeEdit: editedText,
      isEditing: false
    });
  };

  renderButton(): React.Node {
    const { textBeforeEdit } = this.state;

    return (
      <div className="EditableText-buttonContainer">
        <button className="EditableText-button" onClick={this.onButtonClick}>
          {textBeforeEdit}
          <img className="EditableText-editIcon" src={pencil} alt="edit" />
        </button>
      </div>
    );
  }

  onButtonClick = () => {
    const { textBeforeEdit } = this.state;

    this.setState({
      isEditing: true,
      editedText: textBeforeEdit
    });
  };

  render(): React.Node {
    const { isEditing } = this.state;

    return (
      <div className="EditableText-container">
        {isEditing ? this.renderForm() : this.renderButton()}
      </div>
    );
  }
}

export default EditableText;
