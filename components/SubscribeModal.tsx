"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";

import useSubscribeModal from "@/hooks/useSubscribeModal";
import { useUser } from "@/hooks/useUser";
import { postData } from "@/libs/helpers";
import { getStripe } from "@/libs/stripeClient";
import { Price, ProductWithPrice } from "@/types";

import Modal from "./Modal";
import Button from "./Button";

interface SubscribeModalProps {
	products: ProductWithPrice[];
}

const formatPrice = (price: Price) => {
	const priceString = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: price.currency,
		minimumFractionDigits: 0,
	}).format((price?.unit_amount || 0) / 100);

	return priceString;
};

const SubscribeModal: React.FC<SubscribeModalProps> = ({ products }) => {
	const subscribeModal = useSubscribeModal();
	const { user, isLoading, subscription } = useUser();

	const [priceIdLoading, setPriceIdLoading] = useState<string>();

	const onChange = (open: boolean) => {
		if (!open) {
			subscribeModal.onClose();
		}
	};

	const handleCheckout = async (price: Price) => {
		setPriceIdLoading(price.id);
		if (!user) {
			toast.error("Must be logged in");
		} else if (subscription) {
			toast("Already subscribed");
		} else {
			try {
				const { sessionId } = await postData({
					url: "/api/create-checkout-session",
					data: { price },
				});

				const stripe = await getStripe();
				stripe?.redirectToCheckout({ sessionId });
			} catch (error) {
				console.error(error); // log the error
				toast.error((error as Error)?.message);
			}
		}
		setPriceIdLoading(undefined); // moved to finally block
	};

	return (
		<Modal
			title='Only for premium users'
			description='Listen to music with Spotify Premium'
			isOpen={subscribeModal.isOpen}
			onChange={onChange}
		>
			{subscription ? (
				<div className='text-center'>Already subscribed.</div>
			) : products.length ? (
				<div>
					{products.map((product) => {
						if (product.prices?.length==null) {
							return (
								<div
									className='mb-4 text-center'
									key={product.id}
								>
									No prices available
								</div>
							);
						} else
							return product.prices.map((price) => (
								<Button
									key={price.id}
									onClick={() => handleCheckout(price)}
									disabled={
										isLoading || price.id === priceIdLoading
									}
									className='mb-4'
								>
									{`Subscribe for ${formatPrice(price)} a ${
										price.interval
									}`}
								</Button>
							));
					})}
				</div>
			) : (
				<div className='text-center'>No products available.</div>
			)}
		</Modal>
	);
};

export default SubscribeModal;
