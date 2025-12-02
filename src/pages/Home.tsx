import { useTranslation } from "react-i18next";
import type { FunctionComponent } from "../common/types";
import { Link } from "@tanstack/react-router";

export const Home = (): FunctionComponent => {
	const { t, i18n } = useTranslation();

	const onTranslateButtonClick = async (): Promise<void> => {
		if (i18n.resolvedLanguage === "en") {
			await i18n.changeLanguage("es");
		} else {
			await i18n.changeLanguage("en");
		}
	};


	return (
		
		<div className="bg-blue-300 font-bold w-screen h-screen flex flex-col justify-center items-center">
			<Link className="border-b-black border-3 p-[10px] m-[10px]" to="/login">Login</Link>
			<Link className="border-b-black border-3 p-[10px] m-[10px]" to="/companies">Companies</Link>
			<Link className="border-b-black border-3 p-[10px] m-[10px]" to="/vacancies">Vacancies</Link>
			<p className="text-white text-6xl">{t("home.greeting")}</p>
			<button
				className="hover:cursor-pointer"
				type="submit"
				onClick={onTranslateButtonClick}
			>
				translate
			</button>
		</div>
	);
};
