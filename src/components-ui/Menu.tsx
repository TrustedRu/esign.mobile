import * as React from "react";
import { Container, Content, List } from "native-base";
import { StackNavigator } from "react-navigation";
import { styles } from "../styles";

import { ListMenu } from "../components/ListMenu";
import { Headers } from "../components/Headers";
import { ListCertCategory } from "./ListCertCategory";
import { PropertiesCert } from "./PropertiesCert";
import { SelectPersonalСert } from "./SelectPersonalСert";
import { SelectOtherСert } from "./SelectOtherСert";
import { ExportCert } from "./ExportCert";
import { CreateCertificate } from "./CreateCertificate";
import { Signature } from "./Signature";
import { Encryption } from "./Encryption";
import { Certificate } from "./Certificate";
import { Journal } from "./Journal";
import { SelectCert } from "./SelectCert";
import { Containers } from "./Containers";
import { Documents } from "./Documents";

import { getProviders } from "../actions/getContainersAction";
import { readCertKeys } from "../actions/CertKeysAction";
import { readFiles } from "../actions/index";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

function mapStateToProps(state) {
	return {
		certificates: state.certificates.certificates,
		files: state.files.files,
		lastlog: state.logger.lastlog,
		containers: state.containers.containers
	};
}

function mapDispatchToProps(dispatch) {
	return {
		readFiles: bindActionCreators(readFiles, dispatch),
		readCertKeys: bindActionCreators(readCertKeys, dispatch),
		getProviders: bindActionCreators(getProviders, dispatch)
	};
}

interface MainProps {
	navigation: any;
	files: any;
	certificates: any;
	containers: any;
	lastlog: string;
	readCertKeys(): any;
	readFiles(): any;
	getProviders(): any;
}

@(connect(mapStateToProps, mapDispatchToProps) as any)
class Main extends React.Component<MainProps> {

	static navigationOptions = {
		header: null
	};

	render() {
		const { navigate } = this.props.navigation;
		const { files, certificates, lastlog, containers } = this.props;
		let length = "выбрано файлов: " + files.length;
		let persCert = "личных сертификатов: " + certificates.filter(cert => cert.category.toUpperCase() === "MY").length;
		let lengthContainers = "количество контейнеров: " + containers.length;
		let lastlognote = lastlog ? "последняя запись: " + lastlog : "действий не совершалось";
		return (
			<Container style={styles.container}>
				<Headers title="КриптоАРМ" />
				<Content>
					<List>
						<ListMenu title="Подпись / Проверка подписи" img={require("../../imgs/general/sign_main_icon.png")}
							note={length} nav={() => navigate("Signature", { name: "Signature" })} />
						<ListMenu title="Шифрование / Расшифрование" img={require("../../imgs/general/encode_main_icon.png")}
							note={length} nav={() => navigate("Encryption", { name: "Encryption" })} />
						<ListMenu title="Управление сертификатами" img={require("../../imgs/general/certificates_main_icon.png")}
							note={persCert} nav={() => navigate("Certificate", { name: "Certificate" })} />
						<ListMenu title="Документы" img={require("../../imgs/general/documents_main_icon.png")}
							nav={() => navigate("Documents")} />
						<ListMenu title="Управление контейнерами" img={require("../../imgs/general/stores_main_icon.png")}
							note={lengthContainers} nav={() => navigate("Containers")} />
						<ListMenu title="Журнал операций" img={require("../../imgs/general/journal_main_icon.png")}
							note={lastlognote} nav={() => navigate("Journal")} />
					</List>
				</Content>
			</Container>
		);
	}

	componentDidMount() {
		this.props.readFiles();
		this.props.readCertKeys();
		this.props.getProviders();
	}
}

export const App = StackNavigator({
	Main: { screen: Main },
	Signature: { screen: Signature },
	Encryption: { screen: Encryption },
	Certificate: { screen: Certificate },
	Journal: { screen: Journal },
	ListCertCategory: { screen: ListCertCategory },
	PropertiesCert: { screen: PropertiesCert },
	SelectPersonalСert: { screen: SelectPersonalСert },
	SelectOtherСert: { screen: SelectOtherСert },
	CreateCertificate: { screen: CreateCertificate },
	ExportCert: { screen: ExportCert },
	SelectCert: { screen: SelectCert },
	Containers: { screen: Containers },
	Documents: { screen: Documents }
});