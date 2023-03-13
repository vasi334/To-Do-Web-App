function Item(props){
    return <>
        <li><input type="checkbox" onChange={props.onClick}/><label htmlFor={props.for}>{props.description}</label></li>
    </>
}

export default Item