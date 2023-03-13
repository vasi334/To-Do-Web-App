import styles from '../styles/home.module.css'

function Footer(props){
    return <>
        <div className={styles.bottom}>
            <div className={styles["left-side"]}>
                <button className={styles.button} onClick={props.onClickDelete}>Delete</button>
                <button className={styles.button} onClick={props.onClickSetActive}>Set active</button>
                <button className={styles.button} onClick={props.onClickSetCompleted}>Set completed</button>
                <p className={styles.p}>{props.itemsLeft} items left</p>
            </div>
            <div className={styles["right-side"]}>
                <button className={styles.button} onClick={props.onClickAll}>All</button>
                <button className={styles.button} onClick={props.onClickActive}>Active</button>
                <button className={styles.button} onClick={props.onClickCompleted}>Completed</button>
            </div>
        </div>
    </>
}

export default Footer