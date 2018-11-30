import React, { Component } from 'react';
import axios from "axios"

// product Item Layout
class ProductsItem extends Component {

    constructor(props){
        super(props)

    }

    render() {
        // format the price to this format ($1.23)
        const price = this.props.ascii.price
        const formattedPrice = "$"+price.toString().slice(0,1)[0] +"." +price.toString().slice(1)

        return (
            <div style={styles.product}>
                <div style={styles.card}>
                    <h1 style={{fontSize:this.props.ascii.size}}>{this.props.ascii.face}</h1>
                </div>
                <span style={styles.price}>{formattedPrice}</span>
                <span style={styles.date}>{"3 days ago"}</span>

            </div>
            
            
            );
    }
}

// Products List grid
class Products extends Component {


    
    constructor(props){
        super(props)

        // Initialise the default states
        this.state = {
            products:[]
        }
    }

    // get the products list from the server function
    getProducts(){
        axios.get("http://localhost:3000/products")
            .then((res)=>{

            // update the state with the products
            this.setState({products:res.data})
     
        })
        .catch((err)=>{
              console.log(err);
              
        })
    }

    componentDidMount(){

        // fetch the products from teh server whet the component mounts
        this.getProducts()

    }

    render() {
        
        // set up the products List with the product item layout
        const productsList = this.state.products.map((m,i)=>{

            return (
                <ProductsItem key={i} ascii={m} />
            )
        })
        return (
            <div style={styles.productsListStyle}>
                {productsList}
            </div>
            );
    }
}


// list of CSS styles for ever section
const styles = {
    productsListStyle:{
        display:"flex",
        justifyContent:"center",
        flexWrap : "wrap",

    },
    card:{
        width:220,
        height:100,
        margin:10,
        borderColor:"#D4D4D5",
        borderWidth:1,
        borderRadius:5,
        borderStyle:"solid",
        display:"flex",
        justifyContent:"center",
        flexDirection:"column"
    },
    price:{
        fontWeight:"bold",
        fontSize:14,
        color:"crimson"
    },
    date:{
        fontWeight:300,
        fontSize:10,
        color:"#C2C2C2"
    },
    product:{
        marginBottom:20,
        display:"flex",
        flexDirection:"column"
    }
}

export default Products;
