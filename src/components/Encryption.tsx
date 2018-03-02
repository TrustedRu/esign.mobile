import * as React from "react";
import {Container, View, Content, Button, Body, Text, List} from "native-base";
import {Image} from "react-native";
import {Headers} from "./Headers";
import {styles} from "../styles";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {footerAction, footerClose, readFiles} from "../actions/index";
import ListMenu from "./ListMenu";
import FooterSign from "./FooterSign";
import { readCertKeys} from "../actions/CertKeysAction";
import SelectOtherСert from "./SelectOtherСert";

interface EncryptionProps {
  navigation: any;
  footer: any;
  files: any;
  otherCert: any;
  footerAction(any): void;
  footerClose(): void;
  readFiles(): void;
  readCertKeys(string): void;
}

class Encryption extends React.Component<EncryptionProps> {

  static navigationOptions = {
    header: null
  };

  showList(img) {
    return (
      this.props.files.map((file, key) => <ListMenu
        key = {key}
        title={file.name}
        note = {file.mtime}
        img = {img[key]}
        checkbox
        nav={() => this.props.footerAction(key)} />));
  }

  render() {
    const {footerAction, footerClose, files, readFiles, readCertKeys, otherCert} = this.props;
    const { navigate, goBack } = this.props.navigation;

    let certificate, icon;
    if (otherCert.title) { // выбран ли сертификат
      certificate = <List>
        <ListMenu title={otherCert.title} img={otherCert.img}
          note={otherCert.note} nav={() => null} />
      </List>;
      icon = require("../../imgs/general/edit_icon.png");
    } else {
      certificate = <Body><View style={styles.sign_enc_view}>
        <Text style={styles.sign_enc_prompt}>[Добавьте сертификат подписчика]</Text>
      </View></Body>;
      icon = require("../../imgs/general/add_icon.png");
    }

    let img = [];
    for (let i = 0; i < files.length; i++) { // какое расширение у файлов
      switch (files[i].extension) {
        case "pdf":
          img[i] = require("../../imgs/general/file_pdf.png"); break;
        case "txt":
          img[i] = require("../../imgs/general/file_txt.png"); break;
        case "zip":
          img[i] = require("../../imgs/general/file_zip.png"); break;
        case "docx":
          img[i] = require("../../imgs/general/file_docx.png"); break;
        case "sig":
          img[i] = require("../../imgs/general/file_sig.png"); break;
        case "enc":
          img[i] = require("../../imgs/general/file_enc.png"); break;
        default:
          break;
      }
    }

    let footer, selectFiles = null;
    if (this.props.footer.arrButton.length) { // выбраны ли файлы
      footer = <FooterSign encrypt/>;
      selectFiles = <Text style={{fontSize: 17, height: 20, color: "grey"}}>
       выбран(о) {this.props.footer.arrButton.length} файл(ов)</Text>;
    } else {
      selectFiles = <Text style={{height: 20}} ></Text>;
    }
    return (
      <Container style={styles.container}>
        <Headers title="Шифрование/расшифрование" goBack={() => goBack() }/>
        <Content>
          <View style={styles.sign_enc_view}>
            <Text style={styles.sign_enc_title}>Сертификаты получателей</Text>
            <Button transparent style={styles.sign_enc_button} onPress={() => {readCertKeys("enc"); navigate("SelectOtherСert");  } }>
              <Image style={styles.headerImage} source={require("../../imgs/general/add_icon.png")}/>
            </Button>
          </View>
          {certificate}
          <View style={styles.sign_enc_view}>
            <Text style={styles.sign_enc_title}>Файлы</Text>
            {selectFiles}
            <Button transparent style={styles.sign_enc_button} onPress={() => readFiles()}>
              <Image style={styles.headerImage} source={require("../../imgs/general/add_icon.png")}/>
            </Button>
          </View>
          <List>
            {this.showList(img)}
          </List>
        </Content>
        {footer}
      </Container>
    );
  }

  componentDidMount() {
    this.props.footerClose();
    this.props.readFiles();
  }
}

function mapStateToProps (state) {
  return {
    footer: state.footer,
    files: state.files.files,
    otherCert: state.otherCert
  };
}

function mapDispatchToProps (dispatch) {
  return {
    footerAction: bindActionCreators(footerAction, dispatch),
    footerClose: bindActionCreators(footerClose, dispatch),
    readFiles: bindActionCreators(readFiles, dispatch),
    readCertKeys: bindActionCreators(readCertKeys, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Encryption);