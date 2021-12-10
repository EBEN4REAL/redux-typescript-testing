import React from "react";
import styles from "./Cart.module.css";
import {  useAppSelector } from "../../app/hooks";
import {removeFromCart, getTotalPrice, updateQuantity, checkoutCart} from "./cartSlice"
import { useDispatch } from "react-redux";
import classNames from "classnames";

export function Cart() {
  const dispatch = useDispatch()
  
  function onQuantityChange (e: React.FocusEvent<HTMLInputElement, Element>, id: string) {
    const quantity = Number(e.target.value) || 0
    dispatch(updateQuantity({id, quantity}))
  }

  
  const totalPrice = useAppSelector(getTotalPrice)
  const products = useAppSelector((state) => state.products.products)
  const items = useAppSelector((state) => state.cart.items)
  const checkoutState = useAppSelector((state) => state.cart.checkoutState)
  const errorMessage = useAppSelector(state => state.cart.errorMessage)
  
  const tableClasses = classNames({
    [styles.table]: true,
    [styles.checkoutError]: checkoutState === "ERROR",
    [styles.checkoutLoading]: checkoutState === "LOADING"
  })

  function onCheckout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    dispatch(checkoutCart())
  }
  
  return (
    <main className="page">
      <h1>Shopping Cart</h1>
      <table className={tableClasses}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {
            Object.entries(items).map(([id, quantity]) => (
              <tr key={id}>
                <td>{products[id].name}</td>
                <td>
                  <input type="text" className={styles.input} defaultValue={quantity} onBlur={(e) => onQuantityChange(e, id)} />
                </td>
                <td>${products[id].price}</td>
                <td>
                  <button aria-label={`Remove ${products[id].name} from Shopping Cart`} onClick={() =>  dispatch(removeFromCart(id))}>
                    X
                  </button>
                </td>
              </tr>
            ))
          }
         
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td></td>
            <td className={styles.total}>${totalPrice}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
      <form onSubmit={(e) => onCheckout(e)}>
        {
          checkoutState === "ERROR" && errorMessage  ? 
          (
            <p className={styles.errorBox}>{errorMessage}</p>
          ) : null
        }
        <button className={styles.button} type="submit">
          Checkout
        </button>
      </form>
    </main>
  );
}
