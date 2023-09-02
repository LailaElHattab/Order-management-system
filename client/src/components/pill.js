import Badge from 'react-bootstrap/Badge';
import { BsDot } from 'react-icons/bs';
function Pill(props) {
    const content = props.content;
    const isInProgress = props.content === 'In Progress';
    return (
        // <Stack direction="horizontal" gap={2}>
        <Badge bg="light" text="dark" >
            <BsDot style={{ fontSize: '23px', color: isInProgress ? 'red' : 'green' }} /> {content}
        </Badge>
        // </Stack>
    );
}

export default Pill;