import React, { Component } from 'react';
import axios from "axios"
import { Dropdown, Loader, Segment } from 'semantic-ui-react'
import _ from "lodash"



// product Item Layout
class ProductsItem extends Component {

    constructor(props){
        super(props)

        


    }
    
    relativeDate(date){
        // formated date 
        let formattedDate=""
        // today date
        const today = new Date("Fri Nov 30 2018")

        if(today.getFullYear() === date.getFullYear() && today.getMonth() === date.getMonth() && today.getDay() === date.getDay()){
            // today
            formattedDate= "Today"
        }else if(today.getFullYear() === date.getFullYear() && today.getMonth() === date.getMonth() && today.getDay() - date.getDay() ===1){
            // one day ago
            formattedDate = "One day ago"
        }else if(today.getFullYear() === date.getFullYear() && today.getMonth() === date.getMonth() && today.getDay() - date.getDay() >0){
            // This week
            formattedDate = today.getDay() - date.getDay() + 1 +" Days ago"

            
        }else{
            // dates older than last week
            const dateSPlit = date.toString().split(" ")
            formattedDate = dateSPlit[0]+" " + dateSPlit[1]+" " + dateSPlit[2]+" " + dateSPlit[3]

        }

        return formattedDate

    }
    render() {
        // format the price to this format ($1.23)
        const price = this.props.ascii.price

        let formattedPrice = ""

        if(price.toString().length === 1){
            formattedPrice = "$"+price
        }else{
            formattedPrice = "$"+price.toString().slice(0,1)[0] +"." +price.toString().slice(1)
        }

        // format date
        let formattedDate = this.relativeDate(new Date(this.props.ascii.date))
        
        

        return (
            <div style={styles.product}>
                <div style={styles.card}>
                    <h1 style={{fontSize:this.props.ascii.size}}>{this.props.ascii.face}</h1>
                </div>
                <span style={styles.price}>{formattedPrice}</span>
                <span style={styles.date}>{ formattedDate }</span>

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
            products:[],
            sort:"",
            page:1,
            productsCompleted:false,
            loading:false

        }


        
        // CHeck if the bottom is reached,
        window.onscroll = (e) =>{

                // get window Height
                const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
                const body = document.body;
                const html = document.documentElement;

                // calculate the documents height value
                const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
                // calculate the bottom height value
                const windowBottom = windowHeight + window.pageYOffset;

                //check if bottom is reached
                if (windowBottom >= docHeight) {
                    

                    // Only load if the catalog didn't end and  there is no ongoing loading of products
                    if(!this.state.productsCompleted && !this.state.loading ){
                        this.getProducts(this.state.page++)
                        this.setState({page:this.state.page++})
                    }
                   
                }
        }

    }

    // get the products list from the server function
    getProducts(page){

        this.setState({loading:true})
        axios.get(`http://localhost:3000/products?_page=${page}&_limit=50`)
            .then((res)=>{

            // update the state with the products
            let currentList = this.state.products
            
            // add the new products to the current one if it has products, if not mark the end of the catalog

            if(res.data.length>0){
                this.setState({products:[...currentList,...res.data],loading:false})

            }else{
                this.setState({productsCompleted:true,loading:false})

            }
     
        })
        .catch((err)=>{
              console.log(err);
              
        })
    }

    componentDidMount(){

        // fetch the products from teh server whet the component mounts
        this.getProducts(this.state.page)

    }

    // update state when the input field changes
    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value })
        this.handleSort()
    }

    // handle the sort
    handleSort =  () => {
        const { products, sort } = this.state
        const newList = _.orderBy(products, [sort])

        console.log(newList)
    
        
    
        this.setState({
          products: newList,
          
        })
      }


    render() {

        // drop down options
        const dropDownOptions = [
            {
                text:"Price",
                value:"price"
            },
            {
                text:"Size",
                value:"size"
            },
            {
                text:"Id",
                value:"id"
            }
            
            
        ]
        // sort products
        const { products, sort } = this.state
        const newList = _.orderBy(products, [sort])

        // set up the products List with the product item layout
        const productsList = newList.map((m,i)=>{

            return (
                <ProductsItem key={i} ascii={m} />
            )
        })


        // loading spinner
        const loading = (
            <Loader inline active style={{marginTop:20}}>Loading...</Loader>
        )
        
        // end of the catalog text
        const end = (
            <h1 style={{marginBottom:30}}>~ end of catalogue ~</h1>
        )
        return (
            <div > 
                <div>
                    <Dropdown name="sort" placeholder="Sort by" inline selection options={dropDownOptions} onChange={this.handleChange}  />
                </div>
                <div className="list" style={styles.productsListStyle}>
                    {productsList}
                </div>

                {this.state.loading ? loading : null}

                {this.state.productsCompleted ? end : null }


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
        width:250,
        height:180,
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
        fontSize:16,
        color:"crimson"
    },
    date:{
        fontWeight:300,
        fontSize:12,
        color:"#C2C2C2"
    },
    product:{
        marginBottom:20,
        display:"flex",
        flexDirection:"column"
    }
}

export default Products;
