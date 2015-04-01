// Copyright (c) 2012-2014 Kofax. Use of this code is with permission pursuant to Kofax license terms.
package com.kofax.mobile.sdk.cordova.plugins.controls;

import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.CompoundButton.OnCheckedChangeListener;
import android.widget.LinearLayout;
import android.widget.LinearLayout.LayoutParams;
import android.widget.RadioButton;
import android.widget.RadioGroup;

import com.kofax.kmc.kui.uicontrols.ImageCaptureView;
import com.kofax.kmc.kui.uicontrols.data.Flash;

public class CaptureFlashControl implements OnClickListener, OnCheckedChangeListener {
    private LinearLayout flashSettingsView;
    private ImageCaptureView captureView;
    private Button flashMenuButton;
    private boolean flashMenuVisible;
    private RadioButton autoButton;
    private RadioButton onButton;
    private RadioButton offButton;

    public CaptureFlashControl(View parentView, ImageCaptureView captureView) {
        this.captureView = captureView;

        flashSettingsView = new LinearLayout(parentView.getContext());
        LayoutParams params = new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT);
        flashSettingsView.setLayoutParams(params);

        flashMenuButton = new Button(flashSettingsView.getContext());
        params = new LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT);
        flashMenuButton.setLayoutParams(params);
        flashMenuButton.setText("Flash");
        flashMenuButton.setOnClickListener(this);
        flashSettingsView.addView(flashMenuButton);

        RadioGroup group = new RadioGroup(flashSettingsView.getContext());
        group.setLayoutParams(params);
        flashSettingsView.addView(group);

        autoButton = new RadioButton(group.getContext());
        autoButton.setLayoutParams(params);
        autoButton.setOnCheckedChangeListener(this);
        autoButton.setText("Auto");
        autoButton.setVisibility(View.INVISIBLE);
        group.addView(autoButton);

        onButton = new RadioButton(group.getContext());
        onButton.setLayoutParams(params);
        onButton.setOnCheckedChangeListener(this);
        onButton.setText("On");
        onButton.setVisibility(View.INVISIBLE);
        group.addView(onButton);

        offButton = new RadioButton(group.getContext());
        offButton.setLayoutParams(params);
        offButton.setOnCheckedChangeListener(this);
        offButton.setText("Off");
        offButton.setVisibility(View.INVISIBLE);
        group.addView(offButton);
    }

    public View getView() {
        return flashSettingsView;
    }

    @Override
    public void onClick(View v) {
        assert (v == flashMenuButton);

        flashMenuVisible = !flashMenuVisible;
        autoButton.setVisibility(flashMenuVisible ? View.VISIBLE : View.INVISIBLE);
        onButton.setVisibility(flashMenuVisible ? View.VISIBLE : View.INVISIBLE);
        offButton.setVisibility(flashMenuVisible ? View.VISIBLE : View.INVISIBLE);
    }

    @Override
    public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
        if (buttonView == autoButton) {
            if (isChecked) {
                captureView.setFlash(Flash.AUTO);
            }
        } else if (buttonView == onButton) {
            if (isChecked) {
                captureView.setFlash(Flash.ON);
            }
        } else if (buttonView == offButton) {
            if (isChecked) {
                captureView.setFlash(Flash.OFF);
            }
        }
    }
}
