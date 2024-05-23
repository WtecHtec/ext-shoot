import { useCallback, useEffect, useRef } from "react";


const useDebounce = (fn, delay, deep = []) => {
	const ref = useRef({
		fn,
		time: null,
	});
	useEffect(()=> {
		ref.current.fn = fn;
	}, [fn]);
	return useCallback((...args) => {
		if (ref.current.time) {
			console.log(...args);
			clearTimeout(ref.current.time);
		}
		ref.current.time = setTimeout(() => {
			ref.current.fn(...args);
		}, delay);
	}, [deep]);
};

export default useDebounce;