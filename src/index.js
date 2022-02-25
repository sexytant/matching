import React, { useState, useMemo, useEffect } from "react";
import ReactDOM from "react-dom";
import { Container, Draggable } from "react-smooth-dnd";
import { useLocation, BrowserRouter as Router } from "react-router-dom";
import {arrayMoveImmutable} from "array-move";
import {Box, List, Paper, Select, ListItemButton, ListItemText, MenuItem, Button, Radio,RadioGroup, FormControlLabel, InputLabel, FormControl} from "@mui/material";
import senior_students from "./senior_students.json";
import junior_students from "./junior_students.json";

function useQuery() {
  const { search } = useLocation();
  return useMemo(()=> new URLSearchParams(search), [search]);
}


const SortableList = ({data}) => {
  let query = useQuery();
  const [items,setItems] = useState(data);
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

  useEffect(() => {
    setItems(data);
  }, [data])
 
  // @see https://github.com/kutlugsahin/react-smooth-dnd
  return (
    <div>
    <div style={{ display: "flex", gap: "10px" }}>
      <Paper style={{ padding: "0 10px" }}>
        <h4>ドラッグ&ドロップで並び順操作</h4>
        <List>
          <Container onDrop={onDrop}>
            {items.map(({ id, text }) => (
              <Draggable key={id}>
                <ListItemButton style={{ border: "solid 1px" }} >
                  <ListItemText primary={text} />
                </ListItemButton>
              </Draggable>
            ))}
          </Container>
        </List>
      </Paper>
    </div>
        <input name="entry.189157650" type="hidden" value={query.get('id')} required="required"></input>
        <textarea style={{display:'none'}} name="entry.398476216" required="required" value={
          JSON.stringify(
            Array.from(items).sort((a, b) => a.id - b.id),
            null,
            2
          )
        }></textarea>
    </div>
  );
};

const VotingPage = ({ group }) => {
  const [selectUserMail, setSelectUserMail] = useState("");

  const userList = (group === "senior") ? senior_students : junior_students;
  const candidateList = (group === "junior") ? senior_students : junior_students;

  return (
    <form action="https://docs.google.com/forms/u/0/d/e/1FAIpQLSegJchoGRpYPoMhOpc7WzOg1mLi_aq_KyGQMpo1u857ZTIwog/formResponse">
      <Box sx={{ maxWidth: 320 }}>
        <FormControl fullWidth>
          <InputLabel>E-mail</InputLabel>
          <Select label={"E-mail"} value={selectUserMail} onChange={(e)=>{ setSelectUserMail(e.target.value) } } >
            {
              userList.map( user => <MenuItem value={user.mail} >{user.mail}</MenuItem>)
            }
          </Select>
          <SortableList data={candidateList} />
          <Button type="submit" name="button" variant="contained">Submit</Button>
        </FormControl>
      </Box>
    </form>
  )
}

const App = () => {
  const [group, setGroup] = React.useState("junior");

  return (
    <div>
      <h1>投票ページ</h1>
      <p>あなたの属性を選択してください</p>
      
      <RadioGroup
        aria-label="myGroup"
        defaultValue="junior"
        name="myGroup"
        onChange={ (e) => { setGroup(e.target.value); }}
      >
        <FormControlLabel value="junior" control={<Radio />} label="私は下級生です" />
        <FormControlLabel value="senior" control={<Radio />} label="私は上級生です" />
      </RadioGroup>

      <p>あなたの名前とメールアドレスを選択</p>

      <VotingPage group={group}/>

    </div>
  );
}

ReactDOM.render(
  <Router>
    <App />
  </Router>, 
document.getElementById("root"));
