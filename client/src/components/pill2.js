import Badge from 'react-bootstrap/Badge';

function Pill2(props) {
    const content = props.content;
    const isInProgress = props.content === 'In Progress';
    return (

        <Badge pill bg={isInProgress ? 'warning' : 'success'}>
            {isInProgress ? 'In Progress' : 'Delivered'}
        </Badge>


    );
}

export default Pill2;
