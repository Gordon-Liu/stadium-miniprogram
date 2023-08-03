// pages/login/login.js
import { ApiCode } from "../../apis/cloud";
import UserApi from "../../apis/user"
import { showSuccessToast } from "../../utils/toast";
import Token from "../../utils/token";

Component({
    data: {

    },
    methods: {
        async bindLogin() {
            const res = await UserApi.login();
            if (res.code === ApiCode.SUCCESS) {
                showSuccessToast('登录成功');
                Token.setUser(res.data);
                wx.navigateBack();
            }
        }
    }
})