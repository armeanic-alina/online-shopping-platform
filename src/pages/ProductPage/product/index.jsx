import React, {useEffect, useState} from "react";
import DescriptiveAccountHeader from "../../../components/DescriptiveAccountHeader";
import {Box, Snackbar, Typography} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import {useDispatch, useSelector} from "react-redux";
import {useStyles} from "../style";
import {addPrice} from "../../../redux/reducers/cartPriceReducer";
import {addToCartAsGuest, addToCartAsUser} from "../../../redux/reducers/cartReducer";
import DashboardHeader from "../../../components/DashboardHeader";

const Product = ({product}) => {

    const [quantity, setQuantity] = useState(1)
    const [size, setSize] = useState(1);
    const [message, setMessage] = useState('')
    const [position, setPosition] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'center'
    })
    const classes = useStyles();
    const subtotal = quantity * size * product?.price;
    const {vertical, horizontal, open} = position;
    const {user} = useSelector((state) => state.tokenReducer);
    const dispatch = useDispatch();

    const addToCart = () => {
        product.quantity = quantity * size;
        dispatch(addPrice(subtotal))
        if (user) {
            dispatch(addToCartAsUser(product));
            setQuantity(1);
            setSize(1);
            return;
        }
        dispatch(addToCartAsGuest(product));
        setQuantity(1);
        setSize(1)
    };

    const handleIncrement = () => {
        setQuantity(quantity + 1)
    }

    const handleDecrement = () => {
        setQuantity(quantity - 1)
    }


    useEffect(() => {
        if (quantity < 1) {
            setQuantity(1);
            setPosition({...position, open: true});
            setMessage("Quantity should be at least 1");
        }
        if (quantity > 99) {
            setQuantity(99)
            setPosition({...position, open: true});
            setMessage("Quantity can not be more than 99");
        }
        if (quantity * size > product.quantityInStock) {
            setQuantity(quantity - 1)
            setPosition({...position, open: true});
            setMessage("We are sorry but our current amount of " + product.title + " is " + product.quantityInStock + " kg");
        }
    }, [quantity])

    return (
        <>
            <DashboardHeader />
            <DescriptiveAccountHeader title={product.title}/>
            <Box className={classes.container}>
                <Box className={classes.image}>
                    <img src={product.imagesSet[0].url} alt={product.title}/>
                </Box>
                <Box className={classes.descriptionContainer}>
                    <Box>
                        <Typography className={classes.title}>{product.title}</Typography>
                    </Box>
                    <Box>
                        <Typography className={classes.price}>{"$" + product.price}</Typography>
                    </Box>
                    <Box component='fieldset' mb={3} borderColor='transparent'>
                        <Rating
                            className={classes.rating}
                            name='read-only'
                            value={product.rating}
                            max={5}
                            readOnly
                            precision={0.25}
                        />
                    </Box>
                    <Box className={classes.description}>
                        <Typography>{product.description}</Typography>
                    </Box>
                    <Box className={classes.size}>
                        <Typography className={classes.sizeText}>Size :</Typography>
                        <Box className={classes.sizeVariant}>
                            <Box onClick={() => setSize(1)}
                                 className={(size === 1) ? classes.selected : classes.sizeBox}>1 {product.measureUnit}</Box>
                            <Box onClick={() => setSize(3)}
                                 className={(size === 3) ? classes.selected : classes.sizeBox}>3 {(product.measureUnit === "pack") ? product.measureUnit + "s" : product.measureUnit}</Box>
                            <Box onClick={() => setSize(5)}
                                 className={(size === 5) ? classes.selected : classes.sizeBox}>5 {(product.measureUnit === "pack") ? product.measureUnit + "s" : product.measureUnit.toLowerCase()}</Box>
                        </Box>
                    </Box>
                    <Box className={classes.quantity}>
                        <Typography className={classes.sizeText}>Quantity :</Typography>
                        <Box className={classes.quantitySpiner}>
                            <Box onClick={handleDecrement} className={classes.quantityBox}>-</Box>
                            <Box style={{borderLeft: "0", borderRight: "0"}}
                                 className={classes.quantityBox}>{quantity}</Box>
                            <Box onClick={handleIncrement} className={classes.quantityBox}>+</Box>
                        </Box>
                    </Box>
                    <Box className={classes.quantity}>
                        <Typography className={classes.sizeText}>Subtotal :</Typography>
                        <Typography className={classes.subtotal}>{"$" + subtotal.toFixed(2)}</Typography>
                    </Box>
                    <Box onClick={addToCart} className={classes.button}>
                        <AddShoppingCartIcon/>
                        <Typography style={{fontSize: "18px"}}>Add to cart</Typography>
                    </Box>
                </Box>
            </Box>
            <Snackbar
                style={{height: "1000px"}}
                anchorOrigin={{vertical, horizontal}}
                open={open}
                onClose={() => setPosition({...position, open: false})}
                message={message}
                key={vertical + horizontal}
            />
        </>
    );
}

export default Product;
