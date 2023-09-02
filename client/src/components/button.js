import Button from 'react-bootstrap/Button';

function TypesExample(props) {
    const variant = props.variant;
    return (
        <>
            <Button variant={variant}>Primary</Button>
        </>
    );
}

export default TypesExample;