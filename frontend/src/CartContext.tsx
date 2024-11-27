import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Cart, useGetCart } from "medusa-react";

interface CartContextType {
  cart: Omit<Cart, "refundable_amount" | "refunded_total"> | undefined;
  cartId: string;
  cartQuantity: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProviderHomeMade: React.FC<CartProviderProps> = ({
  children,
}) => {
  const cartId = localStorage.getItem("cart_id") || "error";
  const { cart, isLoading, error, refetch } = useGetCart(cartId);
  const [cartQuantity, setCartQuantity] = useState(0);

  useEffect(() => {
    if (cart?.items) {
      const totalQuantity = cart.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      setCartQuantity(totalQuantity);
    }
  }, [cart?.items]);

  return (
    <CartContext.Provider
      value={{ cart, cartId, isLoading, error, cartQuantity, refetch }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartHomeMade = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
