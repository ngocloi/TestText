// Copyright (c) 2012-2014 Kofax. Use of this code is with permission pursuant to Kofax license terms.
package com.kofax.mobile.sdk.phonegap.TotalAgility;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;

public class RemoteUrlActivity extends Activity {
    public static final String KEY_REMOTE_URL = "RemoteUrl";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.remoteurlprompt);

        SharedPreferences preferences = getPreferences(Context.MODE_PRIVATE);
        String url = preferences.getString(KEY_REMOTE_URL, getString(R.string.defaultRemoteUrl));
        if (url != null && url.length() > 0) {
            EditText text = (EditText) findViewById(R.id.remoteUrlField);
            text.setText(url);
        }
    }

    public void navigateToUrl(View v) {
        EditText text = (EditText) findViewById(R.id.remoteUrlField);
        String url = text.getText().toString();

        SharedPreferences preferences = getPreferences(Context.MODE_PRIVATE);
        preferences.edit().putString(KEY_REMOTE_URL, url).commit();

        Intent intent = new Intent(this, TotalAgility.class);
        intent.putExtra(KEY_REMOTE_URL, url);
        startActivityForResult(intent, 0);
    }
    
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        
        if (requestCode == 0 && resultCode == -1) {
            Toast toast = Toast.makeText(getBaseContext(), data.getStringExtra("ErrorMessage"), Toast.LENGTH_LONG);
            toast.show();
        }
    }
}
