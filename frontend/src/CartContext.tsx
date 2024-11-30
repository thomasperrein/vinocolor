import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Cart, useCart, useCreateLineItem, useGetCart } from "medusa-react";
import { PaymentSession } from "@medusajs/medusa";

interface CartContextType {
  cart: Omit<Cart, "refundable_amount" | "refunded_total"> | undefined;
  cartIdState: string;
  cartQuantity: number;
  isLoading: boolean;
  error: Error | null;
  refetch: ReturnType<typeof useGetCart>["refetch"];
  handleCartIdChange: (newCartId: string | undefined) => void;
  createCart: ReturnType<typeof useCart>["createCart"];
  createLineItem: ReturnType<typeof useCreateLineItem>;
  activePaymentSession: PaymentSession | undefined;
  clientSecret: string | undefined;
  reloadTrigger: number;
  triggerReload: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProviderHomeMade: React.FC<CartProviderProps> = ({
  children,
}) => {
  const [cartQuantity, setCartQuantity] = useState(0);
  const [cartIdState, setCartIdState] = useState(
    localStorage.getItem("cart_id") || "error"
  );
  const { cart, isLoading, error, refetch } = useGetCart(cartIdState);
  const { createCart } = useCart();
  const createLineItem = useCreateLineItem(cartIdState);
  const activePaymentSession = cart?.payment_sessions?.[0];

  const [reloadTrigger, setReloadTrigger] = useState(0);

  const triggerReload = () => {
    setReloadTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    if (cart?.items) {
      const totalQuantity = cart.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      setCartQuantity(totalQuantity);
    }
  }, [cart?.items, cartIdState]);

  const handleCartIdChange = (newCartId: string | undefined) => {
    if (!newCartId) {
      localStorage.removeItem("cart_id");
      setCartIdState("error");
      return;
    }
    localStorage.setItem("cart_id", newCartId);
    setCartIdState(newCartId);
  };
  let clientSecret: string | undefined;
  if (cart?.payment_sessions?.[0]?.data.client_secret) {
    clientSecret = cart?.payment_sessions?.[0].data.client_secret as string;
  } else {
    clientSecret = undefined;
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        cartIdState,
        isLoading,
        error,
        cartQuantity,
        refetch,
        handleCartIdChange,
        createCart,
        createLineItem,
        activePaymentSession,
        clientSecret,
        reloadTrigger,
        triggerReload,
      }}
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
