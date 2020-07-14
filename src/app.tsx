import * as React from "react";
import * as ReactDOM from "react-dom";
import { Container, Button, List, ListItem, ListItemText, ListItemIcon, ListItemSecondaryAction, IconButton, Link, Paper } from '@material-ui/core';
import ImportantDevices from '@material-ui/icons/ImportantDevices';
import Assessment from '@material-ui/icons/Assessment';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';

const candidates = [
    {
        title: "ITクラスタ",
        url: "https://zoom.us/j/k4646464646",
        icon: <ImportantDevices />
    },
    {
        title: "感性クラスタ",
        url: "https://zoom.us/j/h4646464646",
        icon: <Assessment />
    },
    {
        title: "言語クラスタ",
        url: "https://zoom.us/j/n4646464646",
        icon: <LibraryBooks />
    }
]

type Phase = "initial" | "rotating" | "stopping" | "result";

const App = () => {
    const [index, setIndex] = React.useState(0);
    const [phase, setPhase] = React.useState<Phase>("initial");
    const [DT, setDT] = React.useState(100);
    const [result, setResult] = React.useState(0);
    const [goIndex, setGoIndex] = React.useState(0);

    React.useEffect(() => {
        switch(phase){
            case "stopping":
            case "rotating":
                const timerId = setInterval(animate, DT);
                return () => clearInterval(timerId);
        }
    });

    const animate = () => {
        setIndex((index + 1) % candidates.length);
        if(phase == "stopping"){
            setDT(DT + 100);
            if(DT > 1000 && result == index) setPhase("result");
        }
    }

    const restart = () => {
        setPhase("initial");
        setIndex(0);
        setDT(100);
        setGoIndex(0);
    }

    const handleClick = (e: React.MouseEvent) => {
        switch(phase){
            case "initial": setPhase("rotating"); break;
            case "rotating":
                setPhase("stopping");
                setResult(Math.floor(Math.random() * candidates.length));
                break;
            case "result":
                restart();
        }
    }

    const handleLinkClick = (e: React.MouseEvent) => {
        setGoIndex(goIndex + 1);
    }

    const buttonText = () => {
        switch(phase){
            case "initial": return "ルーレットスタート！";
            case "rotating":
            case "stopping": return "ストップ！";
            case "result": return "やり直す";
        }
    }

    const ListPrimary = (title: string, i: number) => phase == "result" ? (i + 1) + ". " + title : title;
    const ListSecondary = (url: string, i: number) => phase == "result" && i <= goIndex ? <Link href={url} target="_blank" rel="noopener" onClick={handleLinkClick}>{url}</Link> : null;

    const rotated = candidates.slice(index, candidates.length).concat(candidates.slice(0, index));

    return <Container maxWidth="sm">
        <h1>グロコミュ座談会ルーレット</h1>
        <p>使い方：ルーレットスタートして、ストップすると止まった後に座談会会場のURLが表示されます。1つ参加すると次のURLが表示されます。</p>
        <Button variant="contained" color="primary" onClick={handleClick} disabled={ phase == "stopping"}>{buttonText()}</Button>
        <List>{rotated.map((c, i) => <ListItem selected={phase == "result" && goIndex == i}>
            <ListItemIcon>{c.icon}</ListItemIcon>
            <ListItemText primary={ListPrimary(c.title, i)} secondary={ListSecondary(c.url, i)} />
        </ListItem>)}</List>
    </Container>
}

ReactDOM.render(<App />, document.getElementById("react-root"));