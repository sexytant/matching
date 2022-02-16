import React, { useState, useMemo } from "react";
import ReactDOM from "react-dom";
import { Container, Draggable } from "react-smooth-dnd";
import { useLocation, BrowserRouter as Router } from "react-router-dom";
import {arrayMoveImmutable} from "array-move";
import List from "@material-ui/core/List";
import Paper from "@material-ui/core/Paper";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";


function useQuery() {
  const { search } = useLocation();
  return useMemo(()=> new URLSearchParams(search), [search]);
}


const SortableList = () => {
  let query = useQuery();

  // 初期データ。state で並び順も含めて管理。
  // 適当なタイミングでこの state をどうこうすることによって並び順の情報を任意に扱えます
  const [items, setItems] = useState([
    { id: "1", text: "小清水", order: 0 },
    { id: "2", text: "植田", order: 1 },
    { id: "3", text: "中村一貴", order: 2 },
    { id: "4", text: "櫻木", order: 3 },
    { id: "5", text: "田中", order: 4 }
  ]);
 
  // Drag And Drop の Drop 時イベント
  // react-smooth-dnd の onDrop で発火
  // このイベントで渡される引数によって元々どのインデックスの要素が消えて、どのインデックスに差し込まれたのかわかります
  const onDrop = ({ removedIndex, addedIndex }) => {
    //@see https://ja.reactjs.org/docs/hooks-reference.html#functional-updates
    // @see https://github.com/sindresorhus/array-move 配列中の要素を動かすスニペットライブラリ
    // イベントで渡された要素の移動を state に伝えます。
    // この際、ライブラリで配列中の要素を移動、各要素のプロパティに現在のインデックスを付与、としています。
    const updater = (items) =>
      arrayMoveImmutable(items, removedIndex, addedIndex).map((item, idx) => {
        return { ...item, order: idx };
      });
    setItems(updater);
  };
 
  // @see https://github.com/kutlugsahin/react-smooth-dnd
  return (
    <div>
    <div style={{ display: "flex", gap: "10px" }}>
      <Paper style={{ width: "50%", padding: "0 10px" }}>
        <h4>ドラッグ&ドロップで並び順操作</h4>
        <List>
          <Container onDrop={onDrop}>
            {items.map(({ id, text }) => (
              <Draggable key={id}>
                <ListItem style={{ border: "solid 1px", background: "white" }}>
                  <ListItemText primary={text} />
                </ListItem>
              </Draggable>
            ))}
          </Container>
        </List>
      </Paper>
    </div>
      <form action="https://docs.google.com/forms/u/0/d/e/1FAIpQLSegJchoGRpYPoMhOpc7WzOg1mLi_aq_KyGQMpo1u857ZTIwog/formResponse">
        <input name="entry.189157650" type="hidden" value={query.get('id')} required="required"></input>
        <textarea style={{display:'none'}} name="entry.398476216" required="required" value={
          JSON.stringify(
            Array.from(items).sort((a, b) => a.id - b.id),
            null,
            2
          )
        }></textarea>
        <Button type="submit" name="button" variant="contained">Submit</Button>
      </form>
    </div>
  );
};
 
ReactDOM.render(<Router><SortableList /></Router>, document.getElementById("root"));
